import { OptionsObject, ProviderContext, SnackbarProvider } from 'notistack'
import React, { ReactNode } from 'react'

/**
 * @provider Snackbar
 * @description Notistack is a React library which makes it super easy to display notifications on your web apps
 * @usage `const { enqueueSnackbar } = useSnackbar()`
 * @import import { useSnackbar } from 'notistack'
 * @function {(message: string, {variant: 'error' | 'success' | 'info'}) => void} enqueueSnackbar - Display a toast to the user

 */
export namespace Snackbar {
  export class Instance {
    private static isSetup = false
    private static enqueueSnackbarRef: ProviderContext['enqueueSnackbar']

    static async setup(useSnackbar: ProviderContext) {
      if (this.isSetup) {
        return
      }

      this.enqueueSnackbarRef = useSnackbar.enqueueSnackbar

      this.isSetup = true
    }

    static enqueueSnackbar(message: string, options: OptionsObject) {
      return this.enqueueSnackbarRef(message, {
        ...options,
        style: { whiteSpace: 'pre-line', fontFamily: 'Helvetica Neue' },
      })
    }
  }

  export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
  }
}
