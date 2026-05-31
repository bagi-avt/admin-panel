import { Button, Layout, Space, Typography } from 'antd'
import { Link, useHistory, useLocation } from 'react-router-dom'

import { useAppDispatch } from '@app/providers'
import { requestLogout } from '@features/auth-by-email'
import { AppRoutes } from '@shared/config'

const { Header } = Layout

const navButtons = [
  { key: AppRoutes.posts, label: 'Posts' },
  { key: AppRoutes.tags, label: 'Tags' },
  { key: AppRoutes.authors, label: 'Authors' },
] as const

export const AppHeader = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(requestLogout())
    history.replace(AppRoutes.login)
  }

  return (
    <Header className="app-header">
      <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
        Test 
      </Typography.Title>
      <Space size={8}>
        {navButtons.map((button) => (
          <Link key={button.key} to={button.key}>
            <Button type={location.pathname.startsWith(button.key) ? 'primary' : 'default'}>
              {button.label}
            </Button>
          </Link>
        ))}
        <Button danger onClick={handleLogout}>
          Выйти
        </Button>
      </Space>
    </Header>
  )
}
