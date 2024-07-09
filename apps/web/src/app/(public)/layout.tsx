'use client'

import { NavigationLayout } from '@web/layouts/NavigationLayout'
import { AuthenticationGuard } from '@web/modules/authentication'
import { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticationGuard type="public">
      <NavigationLayout>{children}</NavigationLayout>
    </AuthenticationGuard>
  )
}
