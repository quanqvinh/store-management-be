import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema'
import { TokenService } from './services/token.service'
import { RefreshService } from './services/refresh.service'

@Module({
	imports: [
		JwtModule,
		MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
	],
	providers: [TokenService, RefreshService],
	exports: [TokenService, RefreshService],
})
export class TokenModule {}
