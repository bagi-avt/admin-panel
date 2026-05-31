import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@app/providers'
import { requestAuthCheck } from './state'

export const useAuthGuard = (refreshKey?: string) => {
  const dispatch = useAppDispatch()
  const isChecking = useAppSelector((state) => state.auth?.isChecking ?? true)
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated ?? false)

  useEffect(() => {
    dispatch(requestAuthCheck())
  }, [dispatch, refreshKey])

  return { isChecking, isAuthenticated }
}
