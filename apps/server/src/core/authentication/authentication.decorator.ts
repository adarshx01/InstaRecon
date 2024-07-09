import { ExecutionContext, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import 'reflect-metadata'

export namespace Authentication {
  const KEY_PUBLIC = 'authentication.public'
  const KEY_USER_NOT_VERIFIED_ALLOWED =
    'authentication.user-not-verified.allowed'
  const KEY_USER_VISITOR_ALLOWED = 'authentication.user-visitor.allowed'

  export const AllowUserNotVerified = (isAllowed = true) =>
    SetMetadata(KEY_USER_NOT_VERIFIED_ALLOWED, isAllowed)

  export function isUserNotVerifiedAllowed(
    context: ExecutionContext,
    reflector: Reflector,
  ): boolean {
    const DEFAULT_VALUE = false

    return (
      getValue(context, reflector, KEY_USER_NOT_VERIFIED_ALLOWED) ??
      DEFAULT_VALUE
    )
  }

  export const Public = () => SetMetadata(KEY_PUBLIC, true)

  export function isPublic(
    context: ExecutionContext,
    reflector: Reflector,
  ): boolean {
    return getValue(context, reflector, KEY_PUBLIC)
  }

  export const AllowVisitor = (isAllowed = true) =>
    SetMetadata(KEY_USER_VISITOR_ALLOWED, isAllowed)

  export function isVisitorAllowed(
    context: ExecutionContext,
    reflector: Reflector,
  ): boolean {
    const DEFAULT_VALUE = true

    return (
      getValue(context, reflector, KEY_USER_VISITOR_ALLOWED) ?? DEFAULT_VALUE
    )
  }

  function getValue(
    context: ExecutionContext,
    reflector: Reflector,
    key: string,
  ): any {
    return reflector.getAllAndOverride<boolean>(key, [
      context.getHandler(),
      context.getClass(),
    ])
  }
}
