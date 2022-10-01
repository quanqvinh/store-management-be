import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAccessGuard extends AuthGuard('access-jwt') {}
export class JwtRefreshGuard extends AuthGuard('refresh-jwt') {}
