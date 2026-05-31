import { Button, Card, Space, Table, Typography } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@app/providers'
import { requestDeleteTag, requestTagsList } from '@entities/tag'
import { AppRoutes } from '@shared/config'
import { formatDateTime } from '@shared/lib/date'

export const TagsPage = () => {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.tags?.list ?? [])
  const isLoading = useAppSelector((state) => state.tags?.isLoading ?? false)
  const errorMessage = useAppSelector((state) => state.tags?.errorMessage ?? null)

  useEffect(() => {
    dispatch(requestTagsList())
  }, [dispatch])

  const handleDelete = async (tagId: number) => {
    dispatch(requestDeleteTag(tagId))
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Порядок',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
    },
    {
      title: 'Создано',
      key: 'createdAt',
      render: (_: unknown, tag: (typeof tags)[number]) => formatDateTime(tag.createdAt),
    },
    {
      title: 'Обновлено',
      key: 'updatedAt',
      render: (_: unknown, tag: (typeof tags)[number]) => formatDateTime(tag.updatedAt),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, tag: (typeof tags)[number]) => (
        <Space>
          <Link to={AppRoutes.tags + `/${tag.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button danger onClick={() => handleDelete(tag.id)}>
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
            Tags
          </Typography.Title>
          <Link to={AppRoutes.tagsCreate}>
            <Button type="primary">Добавить тег</Button>
          </Link>
        </Space>

        {errorMessage ? <Typography.Text type="danger">{errorMessage}</Typography.Text> : null}

        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={tags}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Space>
    </Card>
  )
}
