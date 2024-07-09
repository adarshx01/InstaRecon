import { theme } from 'antd'
import { Inter } from 'next/font/google'

const interFont = Inter({
  subsets: ['latin'],
})

export const Theme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Colors
    colorPrimary: 'black',
    colorPrimaryBg: 'white',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorTextBase: 'black',
    colorLink: 'black',
    colorBgBase: 'white',
    colorBgContainer: 'white',
    // Typography
    fontFamily: `${interFont.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    linkDecoration: 'underline',
    // Layout
    padding: 16,
    boxShadow:
      '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    controlHeight: 32,
    lineType: 'solid',
    lineWidth: 1,
    motion: false,
  },
  components: {
    Form: {
      itemMarginBottom: '22px',
    },
    Layout: {
      headerBg: 'white',
      footerBg: 'white',
      bodyBg: 'white',
      siderBg: '#fbfbfb',
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemHeight: 30,
      itemColor: '#909090',
      itemSelectedColor: 'black',
      itemHoverBg: 'transparent',
      itemSelectedBg: 'transparent',
      itemBg: 'transparent',
      itemActiveBg: 'transparent',
    },
  },
}
