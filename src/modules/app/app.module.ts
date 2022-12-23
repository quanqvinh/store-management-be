import { Module } from '@nestjs/common'
// import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
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
import { ProductModule } from '@/modules/product/product.module'
import { FileModule } from '@/modules/file/file.module'
import { DatabaseConnectionName } from '@/constants'
// import { CleanerModule } from '@/modules/cleaner/cleaner.module'
import { StoreModule } from '@/modules/store/store.module'
import { SettingModule } from '@/modules/setting/setting.module'
import { MailModule } from '@/modules/mail/mail.module'
import { MemberRankModule } from '@/modules/member-rank/member-rank.module'
import { CouponModule } from '../coupon/coupon.module'
import { AppliedCouponModule } from '../applied-coupon/applied-coupon.module'
import { CartModule } from '../cart/cart.module'
import { OrderModule } from '../order/order.module'
import { PromotionModule } from '../promotion/promotion.module'

const THROTTLER_TTL = 60
const THROTTLER_LIMIT = 10

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			load: [envConfigLoad],
			validationSchema: envConfigValidate,
			cache: true,
		}),
		MongooseModule.forRootAsync({
			useFactory: async (
				configService: ConfigService
			): Promise<MongooseModuleOptions> => ({
				uri: configService.get<string>('mongo.dataUrl'),
			}),
			inject: [ConfigService],
			connectionName: DatabaseConnectionName.DATA,
		}),
		MongooseModule.forRootAsync({
			useFactory: async (
				configService: ConfigService
			): Promise<MongooseModuleOptions> => ({
				uri: configService.get<string>('mongo.storageUrl'),
			}),
			inject: [ConfigService],
			connectionName: DatabaseConnectionName.STORAGE,
		}),
		AuthModule,
		FileModule,
		MemberModule,
		EmployeeModule,
		ProductModule,
		StoreModule,
		SettingModule,
		// CleanerModule,
		MailModule,
		MemberRankModule,
		CouponModule,
		AppliedCouponModule,
		CartModule,
		OrderModule,
		PromotionModule,
		ThrottlerModule.forRoot({
			ttl: THROTTLER_TTL,
			limit: THROTTLER_LIMIT,
		}),
	],
	controllers: [],
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
