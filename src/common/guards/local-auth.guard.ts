import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAdminGuard extends AuthGuard('local-admin') {}

@Injectable()
export class LocalMemberGuard extends AuthGuard('local-member') {}

@Injectable()
export class LocalSalespersonGuard extends AuthGuard('local-salesperson') {}
