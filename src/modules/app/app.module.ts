import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from '@modules/user/user.module'
import envConfigValidate from '@common/validates/env-config.validate'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter, MongoExceptionFilter } from '@common/filters'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envConfigValidate,
			cache: true,
		}),
		MongooseModule.forRoot(process.env.MONGODB_URL),
		UserModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: MongoExceptionFilter,
		},
	],
})
export class AppModule {}
