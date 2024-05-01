import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { AppRequestInterface } from '@/types/app-request.interface'

const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AppRequestInterface>()
  if (!req.user) return null
  if (data) return req.user[data as keyof AppRequestInterface['user']]
  return req.user
})

const UserSub = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AppRequestInterface>()
  const { sub } = request.user ?? {}

  if (typeof sub !== 'string') {
    console.debug('sub is not a string', sub)
    throw new ForbiddenException('Invalid user object in JWT')
  }

  return sub
})

export { User, UserSub }
