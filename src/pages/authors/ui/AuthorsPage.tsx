import { Button, Card, Image, Space, Table, Typography } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@app/providers'
import { requestAuthorsList, requestDeleteAuthor } from '@entities/author'
import { AppRoutes } from '@shared/config'
import { formatDateTime } from '@shared/lib/date'

export const AuthorsPage = () => {
  const dispatch = useAppDispatch()
  const authors = useAppSelector((state) => state.authors?.list ?? [])
  const isLoading = useAppSelector((state) => state.authors?.isLoading ?? false)
  const errorMessage = useAppSelector((state) => state.authors?.errorMessage ?? null)

  useEffect(() => {
    dispatch(requestAuthorsList())
  }, [dispatch])

  const handleDelete = async (authorId: number) => {
    dispatch(requestDeleteAuthor(authorId))
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Отчество',
      dataIndex: 'secondName',
      key: 'secondName',
    },
    {
      title: 'Аватар',
      key: 'avatar',
      render: (_: unknown, author: (typeof authors)[number]) =>
        author.avatar?.url ? (
          <a href={author.avatar.url} target="_blank" rel="noreferrer">
            <Image
              src={author.avatar.url}
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
      render: (_: unknown, author: (typeof authors)[number]) => formatDateTime(author.createdAt),
    },
    {
      title: 'Обновлено',
      key: 'updatedAt',
      render: (_: unknown, author: (typeof authors)[number]) => formatDateTime(author.updatedAt),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, author: (typeof authors)[number]) => (
        <Space>
          <Link to={AppRoutes.authors + `/${author.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button danger onClick={() => handleDelete(author.id)}>
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
            Authors
          </Typography.Title>
          <Link to={AppRoutes.authorsCreate}>
            <Button type="primary">Добавить автора</Button>
          </Link>
        </Space>

        {errorMessage ? (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        ) : null}

        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={authors}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Space>
    </Card>
  )
}
