import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { EmployeeModule } from '@/modules/employee/employee.module'
import { MemberModule } from '@/modules/member/member.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import {
	HttpExceptionFilter,
	MongoExceptionFilter,
	JoiExceptionFilter,
} from '@/common/filters'
import { envConfigValidate, envConfigLoad } from '@/config/env.config'
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			load: [envConfigLoad],
			validationSchema: envConfigValidate,
			cache: true,
		}),
		MongooseModule.forRoot(envConfigLoad().mongo.url),
		EmployeeModule,
		MemberModule,
		AuthModule,
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
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
		{
			provide: APP_FILTER,
			useClass: JoiExceptionFilter,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
	],
})
export class AppModule {}
