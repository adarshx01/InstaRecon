import { useConfiguration } from '@web/core/configuration'
import { ReactNode } from 'react'
import { useMessageReceived, useMessageSend } from './hooks/useMessage'

type Props = {
  children: ReactNode
}

const useMichelangelo = () => {
  const configuration = useConfiguration()

  if (!configuration.isMarblismMichelangeloActive) {
    return
  }

  useMessageSend()

  useMessageReceived()

  return <></>
}

export const MichelangeloProvider: React.FC<Props> = ({ children }) => {
  useMichelangelo()

  return <>{children}</>
}
