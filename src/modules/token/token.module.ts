import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import {
	RefreshToken,
	RefreshTokenSchema,
} from './schemas/refresh-token.schema'
import { OtpToken, OtpTokenSchema } from './schemas/otp-token.schema'
import { TokenService } from './services/token.service'
import { RefreshService } from './services/refresh.service'
import { DatabaseConnectionName } from '@/constants'
import { OtpService } from './services/otp.service'

@Module({
	imports: [
		JwtModule,
		MongooseModule.forFeature(
			[{ name: RefreshToken.name, schema: RefreshTokenSchema }],
			DatabaseConnectionName.DATA
		),
		MongooseModule.forFeature(
			[{ name: OtpToken.name, schema: OtpTokenSchema }],
			DatabaseConnectionName.DATA
		),
	],
	providers: [TokenService, RefreshService, OtpService],
	exports: [TokenService, RefreshService, OtpService],
})
export class TokenModule {}
