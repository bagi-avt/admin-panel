import { Redirect, Route, type RouteProps } from 'react-router-dom'
import { Spin } from 'antd'

import { AppRoutes } from '@shared/config'
import { useAuthGuard } from '../model'

type PreventDirectAccessGuardProps = RouteProps

const GuardedRouteContent = ({
  component: Component,
  render,
  props,
}: {
  component?: RouteProps['component']
  render?: RouteProps['render']
  props: Parameters<NonNullable<RouteProps['render']>>[0]
}): JSX.Element | null => {
  const { isChecking, isAuthenticated } = useAuthGuard()

  if (isChecking) {
    return <Spin size="large" />
  }

  if (!isAuthenticated) {
    return <Redirect to={AppRoutes.login} />
  }

  if (Component) {
    return <Component {...props} />
  }

  if (render) {
    return <>{render(props)}</>
  }

  return null
}

export const PreventDirectAccessGuard = ({
  component: Component,
  render,
  ...rest
}: PreventDirectAccessGuardProps) => (
  <Route
    {...rest}
    render={(props) => <GuardedRouteContent component={Component} render={render} props={props} />}
  />
)
