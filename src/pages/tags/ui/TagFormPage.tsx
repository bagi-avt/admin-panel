import { Button, Card, Input, InputNumber, Result, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useHistory, useParams } from 'react-router-dom'

import { createTag, getTagById, updateTag } from '@entities/tag'
import { AppRoutes } from '@shared/config'
import { getErrorMessage } from '@shared/lib/error'

interface TagFormPageProps {
  mode: 'create' | 'edit'
}

interface TagEditParams {
  tagId: string
}

interface TagFormValues {
  name: string
  code: string
  sort: number | null
}

export const TagFormPage = ({ mode }: TagFormPageProps) => {
  const history = useHistory()
  const { tagId } = useParams<TagEditParams>()
  const editingId = Number(tagId)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    defaultValues: {
      name: '',
      code: '',
      sort: 0,
    },
  })

  useEffect(() => {
    let isMounted = true

    const loadTag = async () => {
      if (mode !== 'edit') {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const editingTag = await getTagById(editingId)
        if (!isMounted) {
          return
        }

        setNotFound(false)

        if (!editingTag) {
          setNotFound(true)
          return
        }

        reset({
          name: editingTag.name,
          code: editingTag.code,
          sort: editingTag.sort,
        })
      } catch (error) {
        if (!isMounted) {
          return
        }
        setErrorMessage(getErrorMessage(error, 'Не удалось загрузить тег'))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadTag()

    return () => {
      isMounted = false
    }
  }, [editingId, mode, reset])

  if (notFound) {
    return (
      <Result
        status="404"
        title="Тег не найден"
        subTitle="Не удалось открыть страницу редактирования."
        extra={
          <Link to={AppRoutes.tags}>
            <Button type="primary">К списку тегов</Button>
          </Link>
        }
      />
    )
  }

  const handleSave = async (values: TagFormValues) => {
    const normalized = {
      name: values.name.trim(),
      code: values.code.trim(),
      sort: values.sort ?? 0,
    }

    if (!normalized.name || !normalized.code) {
      return
    }

    setErrorMessage(null)
    setIsSaving(true)

    try {
      if (mode === 'create') {
        await createTag(normalized)
      } else {
        await updateTag(editingId, normalized)
      }

      history.replace(AppRoutes.tags)
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          mode === 'create' ? 'Не удалось создать тег' : 'Не удалось обновить тег',
        ),
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="page-card">
      <form onSubmit={handleSubmit(handleSave)}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Title level={2}>{mode === 'create' ? 'Создание тега' : 'Редактирование тега'}</Typography.Title>
          {isLoading ? <Typography.Text type="secondary">Загрузка...</Typography.Text> : null}
          {errorMessage ? <Typography.Text type="danger">{errorMessage}</Typography.Text> : null}
          <Controller
            control={control}
            name="name"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Название тега" />}
          />
          {errors.name ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="code"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Код (slug)" />}
          />
          {errors.code ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="sort"
            render={({ field }) => (
              <InputNumber
                value={field.value}
                onChange={(value) => field.onChange(typeof value === 'number' ? value : null)}
                onBlur={field.onBlur}
                placeholder="Сортировка"
                style={{ width: '100%' }}
              />
            )}
          />
          <Space>
            <Button type="primary" htmlType="submit" loading={isSaving || isLoading} disabled={isLoading}>
              Сохранить
            </Button>
            <Link to={AppRoutes.tags}>
              <Button>Отмена</Button>
            </Link>
          </Space>
        </Space>
      </form>
    </Card>
  )
}
