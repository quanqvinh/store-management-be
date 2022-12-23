import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Promotion, PromotionSchema } from './schemas/promotion.schema'
import { PromotionController } from './promotion.controller'
import { PromotionService } from './promotion.service'
import { CouponModule } from '../coupon/coupon.module'
import { DatabaseConnectionName } from '@/constants'
import { MemberModule } from '../member/member.module'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Promotion.name, schema: PromotionSchema }],
			DatabaseConnectionName.DATA
		),
		CouponModule,
		MemberModule,
	],
	controllers: [PromotionController],
	providers: [PromotionService],
	exports: [PromotionService],
})
export class PromotionModule {}
