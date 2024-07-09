'use client'

import { ConfigurationProvider } from '@web/core/configuration'
import { CoreStoreProvider } from '@web/core/store'
import { DesignSystem, MrbHtml, MrbMain } from '@web/designSystem'
import { MichelangeloProvider } from '@web/libraries/michelangelo'
import { AuthenticationProvider } from '@web/modules/authentication'
import { GoogleOauth } from '@web/modules/googleOauth'
import { ReactNode } from 'react'
import { SocketProvider } from '../core/socket'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DesignSystem.Provider>
        <MrbHtml>
          <DesignSystem.Nested>
            <ConfigurationProvider>
              <GoogleOauth.Provider>
                <CoreStoreProvider>
                  <AuthenticationProvider>
                    <SocketProvider>
                      <MichelangeloProvider>
                        <MrbMain name="Instagram">{children}</MrbMain>
                      </MichelangeloProvider>
                    </SocketProvider>
                  </AuthenticationProvider>
                </CoreStoreProvider>
              </GoogleOauth.Provider>
            </ConfigurationProvider>
          </DesignSystem.Nested>
        </MrbHtml>
      </DesignSystem.Provider>
    </>
  )
}
