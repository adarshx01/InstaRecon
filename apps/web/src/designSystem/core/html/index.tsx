import { theme } from 'antd'
import { ReactNode } from 'react'

const { useToken } = theme

interface Props {
  children: ReactNode
}

export const MrbHtml: React.FC<Props> = ({ children }: Props) => {
  const { token } = useToken()

  return (
    <html
      lang="en"
      style={{ background: token.colorBgBase, color: token.colorTextBase }}
    >
      <body>{children}</body>
    </html>
  )
}
