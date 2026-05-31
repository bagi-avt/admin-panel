import { Layout } from 'antd'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { useAuthGuard } from '@features/auth-by-email'

import { AppHeader } from './AppHeader'

const { Content } = Layout

interface HeaderLayoutProps {
  children: ReactNode
}

export const HeaderLayout = ({ children }: HeaderLayoutProps) => {
  const location = useLocation()
  const { isChecking, isAuthenticated } = useAuthGuard(location.pathname)
  const canShowHeader = !isChecking && isAuthenticated

  return (
    <Layout className="app-layout">
      {canShowHeader ? <AppHeader /> : null}
      <Content className="app-content">{children}</Content>
    </Layout>
  )
}
