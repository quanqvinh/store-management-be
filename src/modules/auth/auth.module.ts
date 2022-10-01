import { JwtModule } from '@nestjs/jwt/dist'
import { Module } from '@nestjs/common'
import { UserModule } from './../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './passport/local.strategy'

@Module({
	imports: [UserModule, PassportModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
