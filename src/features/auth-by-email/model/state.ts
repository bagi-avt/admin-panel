export interface AuthState {
  isChecking: boolean
  isAuthenticated: boolean
  isSubmitting: boolean
  errorMessage: string | null
}

export const AUTH_MODULE_ID = 'auth'

export const AUTH_CHECK_REQUEST = 'auth/CHECK_REQUEST'
export const AUTH_CHECK_SUCCESS = 'auth/CHECK_SUCCESS'
export const AUTH_CHECK_FAILURE = 'auth/CHECK_FAILURE'

export const AUTH_LOGIN_REQUEST = 'auth/LOGIN_REQUEST'
export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'
export const AUTH_LOGIN_FAILURE = 'auth/LOGIN_FAILURE'

export const AUTH_LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST'

interface AuthCheckRequestAction {
  type: typeof AUTH_CHECK_REQUEST
}

interface AuthCheckSuccessAction {
  type: typeof AUTH_CHECK_SUCCESS
  payload: {
    isAuthenticated: boolean
  }
}

interface AuthCheckFailureAction {
  type: typeof AUTH_CHECK_FAILURE
}

interface AuthLoginRequestAction {
  type: typeof AUTH_LOGIN_REQUEST
  payload: {
    email: string
    password: string
  }
}

interface AuthLoginSuccessAction {
  type: typeof AUTH_LOGIN_SUCCESS
}

interface AuthLoginFailureAction {
  type: typeof AUTH_LOGIN_FAILURE
  payload: {
    message: string
  }
}

interface AuthLogoutRequestAction {
  type: typeof AUTH_LOGOUT_REQUEST
}

export type AuthAction =
  | AuthCheckRequestAction
  | AuthCheckSuccessAction
  | AuthCheckFailureAction
  | AuthLoginRequestAction
  | AuthLoginSuccessAction
  | AuthLoginFailureAction
  | AuthLogoutRequestAction

const initialState: AuthState = {
  isChecking: true,
  isAuthenticated: false,
  isSubmitting: false,
  errorMessage: null,
}

export const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_CHECK_REQUEST:
      return {
        ...state,
        isChecking: true,
      }
    case AUTH_CHECK_SUCCESS:
      return {
        ...state,
        isChecking: false,
        isAuthenticated: action.payload.isAuthenticated,
        errorMessage: null,
      }
    case AUTH_CHECK_FAILURE:
      return {
        ...state,
        isChecking: false,
        isAuthenticated: false,
      }
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        errorMessage: null,
      }
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        isAuthenticated: true,
        errorMessage: null,
      }
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        isAuthenticated: false,
        errorMessage: action.payload.message,
      }
    case AUTH_LOGOUT_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        errorMessage: null,
      }
    default:
      return state
  }
}

export const requestAuthCheck = (): AuthCheckRequestAction => ({
  type: AUTH_CHECK_REQUEST,
})

export const requestLoginByEmail = (email: string, password: string): AuthLoginRequestAction => ({
  type: AUTH_LOGIN_REQUEST,
  payload: { email, password },
})

export const requestLogout = (): AuthLogoutRequestAction => ({
  type: AUTH_LOGOUT_REQUEST,
})
