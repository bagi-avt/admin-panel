import { Card, Flex, Space, Typography } from 'antd'

import { LoginForm } from '@features/auth-by-email'

export const LoginPage = () => (
  <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
    <Space direction="vertical" size={16}>
      <Card className="page-card">
        <Typography.Title level={2}>Добро пожаловать</Typography.Title>
        <LoginForm />
      </Card>
    </Space>
  </Flex>
)
