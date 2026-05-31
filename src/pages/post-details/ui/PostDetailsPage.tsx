import { Button, Card, Image, Result, Space, Typography } from 'antd'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@app/providers'
import { requestPostDetails } from '@entities/post'
import type { PostDetail } from '@entities/post'
import { AppRoutes } from '@shared/config'

interface RouteParams {
  postId: string
}

export const PostDetailsPage = () => {
  const dispatch = useAppDispatch()
  const { postId } = useParams<RouteParams>()
  const post = useAppSelector((state) => state.posts?.details ?? null)
  const isLoading = useAppSelector((state) => state.posts?.isLoadingDetails ?? false)
  const errorMessage = useAppSelector((state) => state.posts?.errorMessage ?? null)

  useEffect(() => {
    const numericPostId = Number(postId)
    if (Number.isInteger(numericPostId) && numericPostId > 0) {
      dispatch(requestPostDetails(numericPostId))
    }
  }, [dispatch, postId])

  if (isLoading) {
    return (
      <Card className="page-card">
        <Typography.Text type="secondary">Загрузка...</Typography.Text>
      </Card>
    )
  }

  if (errorMessage) {
    return (
      <Card className="page-card">
        <Space direction="vertical" size={16}>
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
          <Link to={AppRoutes.posts}>
            <Button>Назад к списку</Button>
          </Link>
        </Space>
      </Card>
    )
  }

  if (!post) {
    return (
      <Result
        status="404"
        title="Пост не найден"
        subTitle="Проверьте ссылку или вернитесь к списку постов."
        extra={
          <Link to={AppRoutes.posts}>
            <Button type="primary">К списку постов</Button>
          </Link>
        }
      />
    )
  }

  return (
    <Card className="page-card">
      <Space direction="vertical" size={16}>
        <Typography.Title level={2}>{post.title}</Typography.Title>
        <Typography.Text type="secondary">code: {post.code}</Typography.Text>
        <Typography.Text>Автор: {post.author.fullName}</Typography.Text>
        <Typography.Text>
          Теги:{' '}
          {post.tags.length
            ? post.tags.map((tag: PostDetail['tags'][number]) => tag.name).join(', ')
            : '-'}
        </Typography.Text>
        {post.previewPicture?.url ? (
          <a href={post.previewPicture.url} target="_blank" rel="noreferrer">
            <Image src={post.previewPicture.url} width={240} preview={false} />
          </a>
        ) : null}
        <Typography.Paragraph>{post.text}</Typography.Paragraph>
        <Link to={AppRoutes.posts}>
          <Button>Назад к списку</Button>
        </Link>
      </Space>
    </Card>
  )
}
