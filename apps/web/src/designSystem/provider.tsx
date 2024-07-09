'use client'

import { ConfigProvider } from 'antd'
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Snackbar } from './providers/snackbar'
import './style/main.scss'
import { Theme } from './theme/theme'

export type DesignSystemContext = {
  isMobile: boolean
}

const DesignSystemContext = createContext<DesignSystemContext>(undefined)

export const useDesignSystem = (): DesignSystemContext => {
  return useContext(DesignSystemContext)
}

type Props = {
  children: ReactNode
}

export namespace DesignSystem {
  export const Provider: React.FC<Props> = ({ children }) => {
    const [isMobile, setMobile] = useState(false)

    const isWindow = typeof window !== 'undefined'

    const theme = Theme as any

    useEffect(() => {
      if (!isWindow) {
        return
      }

      setMobile(window.innerWidth < 992)

      const handleResize = () => {
        setMobile(window.innerWidth < 992)
      }

      // Attach the event listener
      window.addEventListener('resize', handleResize)

      // Cleanup the event listener on component unmount
      return () => {
        if (!isWindow) {
          return
        }

        window.removeEventListener('resize', handleResize)
      }
    }, [])

    return (
      <ConfigProvider theme={theme}>
        <DesignSystemContext.Provider value={{ isMobile }}>
          {children}
        </DesignSystemContext.Provider>
      </ConfigProvider>
    )
  }

  export const Nested: React.FC<Props> = ({ children }) => {
    return <Snackbar.Provider>{children}</Snackbar.Provider>
  }
}
