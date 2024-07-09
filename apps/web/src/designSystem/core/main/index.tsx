import { Snackbar } from '@web/designSystem'
import { Layout } from 'antd'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { MrbSplashScreen } from '../splashScreen'

interface Props {
  name: string
  children: React.ReactNode
}

export const MrbMain: React.FC<Props> = ({ name, children }: Props) => {
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (isLoading) {
      setLoading(false)
    }
  }, [])

  const snackbar = useSnackbar()

  Snackbar.Instance.setup(snackbar)

  return (
    <Layout className="mrb-main">
      {isLoading ? <MrbSplashScreen name={name} /> : children}
    </Layout>
  )
}
