import { useCoreStore } from '@web/core/store'
import { MrbSplashScreen } from '@web/designSystem'
import { Api } from '@web/domain'
import { AuthenticationHook } from '@web/domain/authentication'
import { UserManager } from '@web/domain/user'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { RouterObject } from '../../core/router'
import { GlobalService } from '../global'
import { useAuthentication } from './authentication.context'

type Props = {
  children: ReactNode
  type?: 'authenticated' | 'non-authenticated' | 'public'
}

function AuthenticationGuard({
  children,
  type = 'authenticated',
}: Props): ReactNode {
  const authentication = useAuthentication()
  const store = useCoreStore()
  const pathname = usePathname()
  const router = useRouter()

  const authenticationToken = AuthenticationHook.useToken()

  const [isLoading, setLoading] = useState(true)
  const [pathRedirected, setPathRedirected] = useState<string>()
  const [isRedirected, setRedirected] = useState(false)

  const handleNonAuthenticated = async () => {
    if (authentication.isLoggedIn) {
      router.replace(RouterObject.route.HOME)

      setPathRedirected(RouterObject.route.HOME)

      return
    }

    setLoading(true)

    try {
      const { token } = await Api.Authentication.refresh()

      authenticationToken.setToken(token)

      const user = await Api.User.findMe()

      await GlobalService.initialiseStore({ store })

      if (UserManager.isVisitor(user)) {
        setRedirected(true)

        setLoading(false)

        return
      }

      authentication.login(user)

      router.replace(RouterObject.route.HOME)

      setPathRedirected(RouterObject.route.HOME)
    } catch (error) {
      authentication.logout()

      await GlobalService.cleanStore({ store })

      setRedirected(true)

      setLoading(false)
    }
  }

  const handleProtected = async () => {
    if (authentication.isLoggedIn) {
      setLoading(false)

      setRedirected(true)

      return
    }

    setLoading(true)

    try {
      const { token } = await Api.Authentication.refresh()

      authenticationToken.setToken(token)

      const user = await Api.User.findMe()

      await GlobalService.initialiseStore({ store })

      if (UserManager.isVisitor(user)) {
        authentication.setUser(user)

        router.replace(RouterObject.route.LOGIN)

        setPathRedirected(RouterObject.route.LOGIN)

        return
      }

      authentication.login(user)

      setLoading(false)

      setRedirected(true)
    } catch (error) {
      authentication.logout()

      await GlobalService.cleanStore({ store })

      router.replace(RouterObject.route.LOGIN)

      setPathRedirected(RouterObject.route.LOGIN)
    }
  }

  const handlePublic = async () => {
    if (authentication.isLoggedIn) {
      setLoading(false)

      setRedirected(true)

      return
    }

    setLoading(true)

    try {
      const { token } = await Api.Authentication.registerVisitor()

      authenticationToken.setToken(token)

      const user = await Api.User.findMe()

      await GlobalService.initialiseStore({ store })

      if (UserManager.isVisitor(user)) {
        authentication.setUser(user)
      } else {
        authentication.login(user)
      }
    } catch (error) {
      authentication.logout()

      await GlobalService.cleanStore({ store })
    }

    setLoading(false)

    setRedirected(true)
  }

  useEffect(() => {
    if (type === 'non-authenticated') {
      handleNonAuthenticated()
    } else if (type === 'authenticated') {
      handleProtected()
    } else if (type === 'public') {
      handlePublic()
    }
  }, [type, authentication.isLoggedIn])

  useEffect(() => {
    if (!isLoading) {
      const isReady = pathname === pathRedirected

      if (isReady) {
        setRedirected(true)
      }
    }
  }, [isLoading, pathname])

  return (
    <>
      {isLoading || !isRedirected ? (
        <MrbSplashScreen name="Instagram" />
      ) : (
        children
      )}
    </>
  )
}

export { AuthenticationGuard }
