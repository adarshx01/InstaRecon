'use client'

import { RouterObject } from '@web/core/router'
import { useCoreStore } from '@web/core/store'
import { AuthenticationHook } from '@web/domain/authentication'
import { useAuthentication } from '@web/modules/authentication'
import { GoogleOauth } from '@web/modules/googleOauth'
import { GoogleButton } from '@web/modules/googleOauth/components/googleButton'
import { Button, Flex, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { Header } from '../components/Header'
import { ErrorAlert } from './components/ErrorAlert'
import { LoginForm } from './components/LoginForm'
const { Text } = Typography

export default function LoginPage() {
  const router = useRouter()
  const store = useCoreStore()
  const { enqueueSnackbar } = useSnackbar()
  const authentication = useAuthentication()

  const {
    login,
    isLoading: isLoadingLogin,
    isSuccess: isSuccessLogin,
    errors: errorsLogin,
  } = AuthenticationHook.useLogin()

  const {
    googleCallback,
    isLoading: isLoadingGoogle,
    isSuccess: isSuccessGoogle,
    errors: errorsGoogle,
  } = AuthenticationHook.useGoogle()

  const isSuccess = isSuccessLogin || isSuccessGoogle
  const isLoading = isLoadingLogin || isLoadingGoogle || isSuccess
  const errors = [...errorsLogin, ...errorsGoogle]

  useEffect(() => {
    if (isSuccess) {
      onSuccess()
    }
  }, [isSuccess])

  const onError = () => {
    enqueueSnackbar('Could not login with Google', { variant: 'error' })
  }

  const onSuccess = async () => {
    try {
      router.push(RouterObject.route.HOME)
    } catch (error) {
      enqueueSnackbar('Something went wrong during the initialization', {
        variant: 'error',
      })
    }
  }

  /* -------------------------------- HANDLERS -------------------------------- */

  const handleSubmit = (values: { email: string; password: string }) => {
    login(values)
  }

  const handleGoogleSuccess = (response: { credential: string }) => {
    googleCallback(response)
  }

  return (
    <>
      <Flex align="center" justify="center" vertical flex={1}>
        <Flex
          vertical
          style={{
            width: '340px',
            paddingBottom: '100px',
            paddingTop: '100px',
          }}
          gap="middle"
        >
          <Header description="Welcome back!" />
          <ErrorAlert errors={errors} />

          <LoginForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onResetPassword={() =>
              router.push(RouterObject.route.RESET_PASSWORD)
            }
          />

          {GoogleOauth.useActive() && (
            <GoogleButton onSuccess={handleGoogleSuccess} onError={onError} />
          )}

          <Button
            ghost
            style={{ border: 'none' }}
            onClick={() => router.push(RouterObject.route.REGISTER)}
          >
            <Flex gap={'small'} justify="center">
              <Text type="secondary">No account?</Text> <Text>Sign up</Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </>
  )
}
