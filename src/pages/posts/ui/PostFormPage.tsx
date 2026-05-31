import { Button, Card, Input, InputNumber, Result, Space, Typography, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useHistory, useParams } from 'react-router-dom'
import type { UploadFile } from 'antd/es/upload/interface'

import { createPost, getPostById, updatePost } from '@entities/post'
import { AppRoutes } from '@shared/config'
import { getErrorMessage } from '@shared/lib/error'

interface PostFormPageProps {
  mode: 'create' | 'edit'
}

interface PostEditParams {
  postId: string
}

interface PostFormValues {
  title: string
  code: string
  text: string
  authorId: number | null
  tagIdsRaw: string
  previewPictureFile: File | null
}

export const PostFormPage = ({ mode }: PostFormPageProps) => {
  const history = useHistory()
  const { postId } = useParams<PostEditParams>()
  const editingId = Number(postId)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSaving, setIsSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [previewPictureUrl, setPreviewPictureUrl] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    defaultValues: {
      title: '',
      code: '',
      text: '',
      authorId: null,
      tagIdsRaw: '',
      previewPictureFile: null,
    },
  })
  const previewPictureFile = useWatch({ control, name: 'previewPictureFile' })

  useEffect(() => {
    let isMounted = true

    const loadPost = async () => {
      if (mode !== 'edit') {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const editingPost = await getPostById(editingId)
        if (!isMounted) {
          return
        }

        setNotFound(false)

        if (!editingPost) {
          setNotFound(true)
          return
        }

        reset({
          title: editingPost.title,
          code: editingPost.code,
          text: editingPost.text,
          authorId: editingPost.author.id,
          tagIdsRaw: editingPost.tags.map((tag) => String(tag.id)).join(', '),
          previewPictureFile: null,
        })
        setPreviewPictureUrl(editingPost.previewPicture?.url ?? null)
      } catch (error) {
        if (!isMounted) {
          return
        }
        setErrorMessage(getErrorMessage(error, 'Не удалось загрузить пост'))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPost()

    return () => {
      isMounted = false
    }
  }, [editingId, mode, reset])

  if (notFound) {
    return (
      <Result
        status="404"
        title="Пост не найден"
        subTitle="Не удалось открыть страницу редактирования."
        extra={
          <Link to={AppRoutes.posts}>
            <Button type="primary">К списку постов</Button>
          </Link>
        }
      />
    )
  }

  const handleSave = async (values: PostFormValues) => {
    const parsedTagIds = values.tagIdsRaw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0)

    const normalized = {
      title: values.title.trim(),
      code: values.code.trim(),
      text: values.text.trim(),
      authorId: values.authorId ?? 0,
      tagIds: parsedTagIds,
      previewPictureFile: values.previewPictureFile,
    }

    if (
      !normalized.title ||
      !normalized.code ||
      !normalized.text ||
      !normalized.authorId
    ) {
      return
    }

    setErrorMessage(null)
    setIsSaving(true)

    try {
      if (mode === 'create') {
        await createPost(normalized)
      } else {
        await updatePost(editingId, normalized)
      }

      history.replace(AppRoutes.posts)
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          mode === 'create' ? 'Не удалось создать пост' : 'Не удалось обновить пост',
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
          <Typography.Title level={2}>{mode === 'create' ? 'Создание поста' : 'Редактирование поста'}</Typography.Title>
          {isLoading ? <Typography.Text type="secondary">Загрузка...</Typography.Text> : null}
          {errorMessage ? <Typography.Text type="danger">{errorMessage}</Typography.Text> : null}
          <Controller
            control={control}
            name="title"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Заголовок" />}
          />
          {errors.title ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="code"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input {...field} placeholder="* Код (slug)" />}
          />
          {errors.code ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="authorId"
            rules={{ validate: (value) => typeof value === 'number' && value > 0 }}
            render={({ field }) => (
              <InputNumber
                value={field.value}
                min={1}
                onChange={(value) => field.onChange(typeof value === 'number' ? value : null)}
                onBlur={field.onBlur}
                placeholder="* ID автора"
                style={{ width: '100%' }}
              />
            )}
          />
          {errors.authorId ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          <Controller
            control={control}
            name="tagIdsRaw"
            rules={{
              validate: (value) => {
                const items = value
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean)

                if (items.length === 0) {
                  return true
                }

                return items.every((item) => {
                  const num = Number(item)
                  return Number.isInteger(num) && num > 0
                })
              },
            }}
            render={({ field }) => <Input {...field} placeholder="ID тегов через запятую (например, 1,2,3)" />}
          />
          {errors.tagIdsRaw ? (
            <Typography.Text type="danger">Укажите валидные ID тегов через запятую</Typography.Text>
          ) : null}
          <Controller
            control={control}
            name="text"
            rules={{ validate: (value) => value.trim().length > 0 }}
            render={({ field }) => <Input.TextArea {...field} rows={6} placeholder="* Текст поста" />}
          />
          {errors.text ? <Typography.Text type="danger">Поле обязательно</Typography.Text> : null}
          {previewPictureUrl && !previewPictureFile ? (
            <Space direction="vertical" size={4}>
              <Typography.Text type="secondary">Текущая картинка превью</Typography.Text>
              <a href={previewPictureUrl} target="_blank" rel="noreferrer">
                <img
                  src={previewPictureUrl}
                  alt="preview"
                  style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 4 }}
                />
              </a>
            </Space>
          ) : null}
          <Upload
            accept="image/*"
            maxCount={1}
            beforeUpload={() => false}
            onChange={({ fileList }) => {
              const selectedFile = fileList[0]?.originFileObj ?? null
              setValue('previewPictureFile', selectedFile, { shouldDirty: true })
            }}
            fileList={
              previewPictureFile
                ? [
                    {
                      uid: '-1',
                      name: previewPictureFile.name,
                      status: 'done',
                    } as UploadFile,
                  ]
                : []
            }
            onRemove={() => {
              setValue('previewPictureFile', null, { shouldDirty: true })
              return true
            }}
          >
            <Button>Загрузить</Button>
          </Upload>
          <Space>
            <Button type="primary" htmlType="submit" loading={isSaving || isLoading} disabled={isLoading}>
              Сохранить
            </Button>
            <Link to={AppRoutes.posts}>
              <Button>Отмена</Button>
            </Link>
          </Space>
        </Space>
      </form>
    </Card>
  )
}
