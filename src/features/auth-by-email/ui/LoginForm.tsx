import { Alert, Button, Form, Input } from 'antd'

import { useLoginByEmail } from '../model'

export const LoginForm = () => {
  const { login, isSubmitting, errorMessage } = useLoginByEmail()

  return (
    <Form layout="vertical" onFinish={login}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Введите email' }]}
      >
        <Input placeholder="user@example.com" />
      </Form.Item>
      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password placeholder="******" />
      </Form.Item>
      {errorMessage && <Alert type="error" message={errorMessage} showIcon style={{ marginBottom: 16 }} />}
      <Button type="primary" htmlType="submit" loading={isSubmitting}>
        Войти
      </Button>
    </Form>
  )
}
