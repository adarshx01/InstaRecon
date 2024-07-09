'use client'

import { AuthenticationGuard } from '@web/modules/authentication'
import { ReactNode } from 'react'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticationGuard type="non-authenticated">
      {children}
    </AuthenticationGuard>
  )
}
