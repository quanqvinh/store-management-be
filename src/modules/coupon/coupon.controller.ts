import { NotFoundDataException } from '@/common/exceptions/http'
import { CreateCouponDto, CreateCouponDtoSchema } from './dto/create-coupon.dto'
import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { CouponService } from './coupon.service'
import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import {
	UpdateInfoCouponDto,
	UpdateInfoCouponDtoSchema,
} from './dto/update-info-coupon.dto'
import {
	UpdateNotificationCouponDto,
	UpdateNotificationCouponDtoSchema,
} from './dto/update-notification-coupon.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { File } from '@/types'
import { MemberAppService } from '../setting/services/member-app.service'
import { FileService } from '../file/services/file.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('coupon')
@ApiTags('coupon')
export class CouponController {
	constructor(
		private couponService: CouponService,
		private memberSettingService: MemberAppService,
		private fileService: FileService
	) {}

	@Get('all')
	async getAllCoupon() {
		return await this.couponService.getAll()
	}

	@Get(':id')
	async getOneCoupon(@Param('id', ObjectIdValidatePine) couponId: string) {
		return await this.couponService.getById(couponId)
	}

	@Post()
	@UseInterceptors(FileInterceptor('image'))
	async createNew(
		@UploadedFile() image: File,
		@Body(new JoiValidatePine(CreateCouponDtoSchema))
		createCouponDto: CreateCouponDto
	) {
		const defaultImages = (await this.memberSettingService.get('defaultImages'))
			.defaultImages
		const coupon = await this.couponService.create(
			createCouponDto,
			image?.id ?? defaultImages.coupon ?? undefined
		)
		return !!coupon
	}

	@Patch(':id/info')
	async updateInfoCoupon(
		@Param('id', ObjectIdValidatePine) couponId: string,
		@Body(new JoiValidatePine(UpdateInfoCouponDtoSchema))
		updateInfoCouponDto: UpdateInfoCouponDto
	) {
		const isExist = await this.couponService.checkExist(couponId)
		if (!isExist) throw new NotFoundDataException()

		const result = await this.couponService.update(
			couponId,
			updateInfoCouponDto
		)
		return result.matchedCount === 1 && result.modifiedCount === 1
	}

	@Patch(':id/notification')
	@UseInterceptors(FileInterceptor('image'))
	async updateNotificationCoupon(
		@UploadedFile() image: File,
		@Param('id', ObjectIdValidatePine) couponId: string,
		@Body(new JoiValidatePine(UpdateNotificationCouponDtoSchema))
		updateNotificationCouponDto: UpdateNotificationCouponDto
	) {
		const isExist = await this.couponService.checkExist(couponId)
		if (!isExist) {
			await this.fileService.deleteOne(image.id)
			throw new NotFoundDataException()
		}

		const defaultImages = (await this.memberSettingService.get('defaultImages'))
			.defaultImages

		Object.assign(updateNotificationCouponDto.notification, {
			image: image.id ?? defaultImages.couponNotification ?? undefined,
		})

		const result = await this.couponService.update(
			couponId,
			updateNotificationCouponDto
		)
		return result.matchedCount === 1 && result.modifiedCount === 1
	}
}
