import { AuthenticationHook } from '@web/domain/authentication'
import { useAuthentication } from '@web/modules/authentication'
import { useEffect } from 'react'

type ReturnType = {
  isReady: boolean
}

export const useLogin = (): ReturnType => {
  const { login, errors } = AuthenticationHook.useLogin()
  const { isLoggedIn } = useAuthentication()

  useEffect(() => {
    if (!isLoggedIn) {
      login({ email: 'test@test.com', password: 'password' })
    }
  }, [])

  const isReady = isLoggedIn || errors.length > 0

  return {
    isReady,
  }
}
