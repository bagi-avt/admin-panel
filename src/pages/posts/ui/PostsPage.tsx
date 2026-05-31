import { Button, Card, Image, Space, Table, Typography } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@app/providers'
import { requestDeletePost, requestPostsList } from '@entities/post'
import { AppRoutes } from '@shared/config'
import { formatDateTime } from '@shared/lib/date'

export const PostsPage = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector((state) => state.posts?.list ?? [])
  const isLoading = useAppSelector((state) => state.posts?.isLoadingList ?? false)
  const errorMessage = useAppSelector((state) => state.posts?.errorMessage ?? null)

  useEffect(() => {
    dispatch(requestPostsList())
  }, [dispatch])

  const handleDelete = async (postId: number) => {
    dispatch(requestDeletePost(postId))
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Заголовок',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Автор',
      dataIndex: 'authorName',
      key: 'authorName',
    },
    {
      title: 'Теги',
      key: 'tags',
      render: (_: unknown, post: (typeof posts)[number]) => (post.tagNames.length ? post.tagNames.join(', ') : '-'),
    },
    {
      title: 'Превью',
      key: 'previewPicture',
      render: (_: unknown, post: (typeof posts)[number]) =>
        post.previewPicture?.url ? (
          <a href={post.previewPicture.url} target="_blank" rel="noreferrer">
            <Image
              src={post.previewPicture.url}
              width={40}
              height={40}
              preview={false}
              style={{ objectFit: 'cover' }}
            />
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: 'Создано',
      key: 'createdAt',
      render: (_: unknown, post: (typeof posts)[number]) => formatDateTime(post.createdAt),
    },
    {
      title: 'Обновлено',
      key: 'updatedAt',
      render: (_: unknown, post: (typeof posts)[number]) => formatDateTime(post.updatedAt),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, post: (typeof posts)[number]) => (
        <Space>
          <Link to={AppRoutes.posts + `/${post.id}`}>
            <Button>Открыть</Button>
          </Link>
          <Link to={AppRoutes.posts + `/${post.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button danger onClick={() => handleDelete(post.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card className="page-card">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Posts
          </Typography.Title>
          <Link to={AppRoutes.postsCreate}>
            <Button type="primary">Добавить пост</Button>
          </Link>
        </Space>

        {errorMessage ? <Typography.Text type="danger">{errorMessage}</Typography.Text> : null}

        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={posts}
          pagination={false}
          scroll={{ x: 1100 }}
        />
      </Space>
    </Card>
  )
}
