import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@app/providers'
import { AppRoutes } from '@shared/config'
import { requestLoginByEmail } from './state'

export const useLoginByEmail = () => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const isSubmitting = useAppSelector((state) => state.auth?.isSubmitting ?? false)
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated ?? false)
  const errorMessage = useAppSelector((state) => state.auth?.errorMessage ?? null)

  useEffect(() => {
    if (isAuthenticated) {
      history.replace(AppRoutes.posts)
    }
  }, [history, isAuthenticated])

  const login = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    dispatch(requestLoginByEmail(email, password))
  }

  return { login, isSubmitting, errorMessage }
}
