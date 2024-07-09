import { v4 as uuidv4 } from 'uuid'

export namespace Utility {
  export function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, milliseconds)
    })
  }

  export function getUUID(): string {
    return uuidv4()
  }

  export function buildRandomAlphanumericString(length: number): string {
    const alphanumericCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * alphanumericCharacters.length,
      )
      result += alphanumericCharacters.charAt(randomIndex)
    }

    return result
  }

  export function isDefined(value: any): boolean {
    const isEmptyString = typeof value === 'string' && value === ''
    return value !== null && value !== undefined && !isEmptyString
  }

  export function isNull(value: any): boolean {
    return !isDefined(value)
  }

  export function arrayUnique<Type>(items: Type[]): Type[] {
    const uniqueSet = new Set(items)
    return Array.from(uniqueSet)
  }

  export function removeTrailingSlash(content: string): string {
    const REGEX_SLASH = /\/$/g

    return content.replace(REGEX_SLASH, '')
  }

  export function isEmpty(value: string | string[]): boolean {
    if (!isDefined(value)) {
      return true
    }

    const isArray = Array.isArray(value)

    if (isArray) {
      return value.length === 0
    }

    const isString = typeof value === 'string'

    if (isString) {
      return value.trim() !== ''
    }

    return false
  }
}
