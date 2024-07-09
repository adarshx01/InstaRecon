'use client'

import { RouterService } from '@web/core/router'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { closeSnackbar } from 'notistack'
import { useEffect } from 'react'

/**
 * Emit request when the path changed
 */
export const useMessageSend = () => {
  const pathname = usePathname()
  const params: any = useParams()

  useEffect(() => {
    window.parent.postMessage({ type: 'ready' }, '*')
  }, [])

  useEffect(() => {
    const url = `${window.location.origin}${pathname}`

    const pathPure = RouterService.restoreUrl(pathname, params)

    window.parent.postMessage({ type: 'navigation', url, pathPure }, '*')
  }, [pathname, params])
}

/**
 * Change the path on request
 */
export const useMessageReceived = () => {
  const router = useRouter()

  const handleMessage = event => {
    const canContinue = event?.data?.type === 'navigation'

    if (canContinue) {
      const path = event.data.path?.trim()

      if (path && path !== '') {
        router.push(path)
        closeSnackbar()
      }
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])
}
