import { Button, Card, Checkbox, Image, Input, Result, Space, Typography, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useHistory, useParams } from 'react-router-dom'
import type { UploadFile } from 'antd/es/upload/interface'

import { createAuthor, getAuthorById, updateAuthor } from '@entities/author'
import { AppRoutes } from '@shared/config'
import { getErrorMessage } from '@shared/lib/error'

interface AuthorFormPageProps {
  mode: 'create' | 'edit'
}

interface AuthorEditParams {
  authorId: string
}

interface AuthorFormValues {
  name: string
  lastName: string
  secondName: string
  shortDescription: string
  description: string
  avatarFile: File | null
  removeAvatar: boolean
}

export const AuthorFormPage = ({ mode }: AuthorFormPageProps) => {
  const history = useHistory()
  const { authorId } = useParams<AuthorEditParams>()
  const editingId = Number(authorId)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AuthorFormValues>({
    defaultValues: {
      name: '',
      lastName: '',
      secondName: '',
      shortDescription: '',
      description: '',
      avatarFile: null,
      removeAvatar: false,
    },
  })
  const avatarFile = useWatch({ control, name: 'avatarFile' })
  const removeAvatar = useWatch({ control, name: 'removeAvatar' })

  useEffect(() => {
    let isMounted = true

    const loadAuthor = async () => {
      if (mode !== 'edit') {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const editingAuthor = await getAuthorById(editingId)
        if (!isMounted) {
          return
        }

        setNotFound(false)

        if (!editingAuthor) {
          setNotFound(true)
          return
        }

        reset({
          name: editingAuthor.name,
          lastName: editingAuthor.lastName,
          secondName: editingAuthor.secondName,
          shortDescription: editingAuthor.shortDescription,
          description: editingAuthor.description,
          avatarFile: null,
          removeAvatar: false,
        })
        setAvatarUrl(editingAuthor.avatar?.url ?? null)
      } catch (error) {
        if (!isMounted) {
          return
        }
        setErrorMessage(getErrorMessage(error, 'Не удалось загрузить автора'))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAuthor()

    return () => {
      isMounted = false
    }
  }, [editingId, mode, reset])

  if (notFound) {
    return (
      <Result
        status="404"
        title="Автор не найден"
        subTitle="Не удалось открыть страницу редактирования."
        extra={
          <Link to={AppRoutes.authors}>
            <Button type="primary">К списку авторов</Button>
          </Link>
        }
      />
    )
  }

  const handleSave = async (values: AuthorFormValues) => {
    const normalized = {
      name: values.name.trim(),
      lastName: values.lastName.trim(),
      secondName: values.secondName.trim(),
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      avatarFile: values.avatarFile,
      removeAvatar: values.removeAvatar,
    }

    if (
      !normalized.name ||
      !normalized.lastName ||
      !normalized.secondName ||
      !normalized.shortDescription ||
      !normalized.description
    ) {
      return
    }

    setErrorMessage(null)
    setIsSaving(true)

    try {
      if (mode === 'create') {
        await createAuthor(normalized)
      } else {
        await updateAuthor(editingId, normalized)
      }

      history.replace(AppRoutes.authors)
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          mode === 'create' ? 'Не удалось создать автора' : 'Не удалось обновить автора',
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
          <Typography.Title level={2}>
            {mode === 'create' ? 'Создание автора' : 'Редактирование автора'}
          </Typography.Title>
          {isLoading ? <Typography.Text type="secondary">Загрузка...</Typography.Text> : null}
          {errorMessage ? <Typography.Text type="danger">{errorMessage}</Typography.Text> : null}

          <Controller
            control={control}
            name="lastName"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Фамилия" />}
          />
          {errors.lastName ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="name"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Имя" />}
          />
          {errors.name ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="secondName"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Отчество" />}
          />
          {errors.secondName ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="shortDescription"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Короткое описание" />}
          />
          {errors.shortDescription ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="description"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input.TextArea {...field} rows={6} placeholder="* Описание автора" />}
          />
          {errors.description ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          {avatarUrl && !removeAvatar && !avatarFile ? (
            <Space direction="vertical" size={4}>
              <Typography.Text type="secondary">Текущий аватар</Typography.Text>
              <a href={avatarUrl} target="_blank" rel="noreferrer">
                <Image src={avatarUrl} width={64} height={64} preview={false} style={{ objectFit: 'cover' }} />
              </a>
            </Space>
          ) : null}
          <Upload
            accept="image/*"
            maxCount={1}
            beforeUpload={() => false}
            onChange={({ fileList }) => {
              const selectedFile = fileList[0]?.originFileObj ?? null
              setValue('avatarFile', selectedFile, { shouldDirty: true })
              if (selectedFile) {
                setValue('removeAvatar', false, { shouldDirty: true })
              }
            }}
            fileList={
              avatarFile
                ? [
                    {
                      uid: '-1',
                      name: avatarFile.name,
                      status: 'done',
                    } as UploadFile,
                  ]
                : []
            }
            onRemove={() => {
              setValue('avatarFile', null, { shouldDirty: true })
              return true
            }}
          >
            <Button>Загрузить avatar</Button>
          </Upload>
          {mode === 'edit' && avatarUrl && !avatarFile ? (
            <Controller
              control={control}
              name="removeAvatar"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(event) => {
                    const checked = event.target.checked
                    field.onChange(checked)
                    if (checked) {
                      setValue('avatarFile', null, { shouldDirty: true })
                    }
                  }}
                >
                  Удалить аватарку
                </Checkbox>
              )}
            />
          ) : null}
          <Space>
            <Button type="primary" htmlType="submit" loading={isSaving || isLoading} disabled={isLoading}>
              Сохранить
            </Button>
            <Link to={AppRoutes.authors}>
              <Button>Отмена</Button>
            </Link>
          </Space>
        </Space>
      </form>
    </Card>
  )
}
