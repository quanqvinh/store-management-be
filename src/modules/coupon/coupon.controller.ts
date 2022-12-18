import { NotFoundDataException } from '@/common/exceptions/http'
import {
	CreateCouponDto,
	CreateCouponDtoSchema,
} from './dto/request/create-coupon.dto'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { CouponService } from './coupon.service'
import { JoiValidatePine, ObjectIdValidatePine } from '@/common/pipes'
import {
	UpdateInfoCouponDto,
	UpdateInfoCouponDtoSchema,
} from './dto/request/update-info-coupon.dto'
import {
	UpdateNotificationCouponDto,
	UpdateNotificationCouponDtoSchema,
} from './dto/request/update-notification-coupon.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { File } from '@/types'
import { MemberAppService } from '../setting/services/member-app.service'
import { FileService } from '../file/services/file.service'
import { ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import {
	GetCouponListAdminFilterDto,
	GetCouponListAdminFilterDtoSchema,
} from './dto/request/get-coupon-for-admin.dto'
import { Auth } from '@/common/decorators/auth.decorator'
import { EmployeeRole } from '@/constants'
import {
	DisableCouponDto,
	DisableCouponDtoSchema,
} from './dto/request/disable-coupon.dto'

@Controller('coupon')
@ApiTags('coupon')
export class CouponController {
	constructor(
		private couponService: CouponService,
		private memberSettingService: MemberAppService,
		private fileService: FileService
	) {}

	@Get('all')
	@SkipThrottle()
	async getAllCoupon() {
		return await this.couponService.getAll()
	}

	@Get(':id')
	@SkipThrottle()
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
		body: UpdateNotificationCouponDto
	) {
		const isExist = await this.couponService.checkExist(couponId)
		if (!isExist) {
			await this.fileService.deleteOne(image.id)
			throw new NotFoundDataException()
		}

		const defaultImages = (await this.memberSettingService.get('defaultImages'))
			.defaultImages

		const notification = {
			image: image.id ?? defaultImages.couponNotification ?? undefined,
			title: body.title,
			content: body.content,
		}

		const result = await this.couponService.update(couponId, { notification })
		return result.matchedCount === 1 && result.modifiedCount === 1
	}

	@Get('admin/all')
	@SkipThrottle()
	async getAllForAdmin(
		@Query(new JoiValidatePine(GetCouponListAdminFilterDtoSchema))
		query: GetCouponListAdminFilterDto
	) {
		return await this.couponService.getListForAdmin(query)
	}

	@Patch(':id/disable')
	// @Auth(EmployeeRole.ADMIN)
	async disableCoupon(
		@Param('id', ObjectIdValidatePine) couponId: string,
		@Query(new JoiValidatePine(DisableCouponDtoSchema)) query: DisableCouponDto
	) {
		if (query.instantly === 'true') {
			return await this.couponService.disable(couponId)
		} else {
			return await this.couponService.addDisableFlag(couponId, query.timer)
		}
	}

	@Patch(':id/enable')
	// @Auth(EmployeeRole.ADMIN)
	async enableCoupon(@Param('id', ObjectIdValidatePine) couponId: string) {
		return await this.couponService.enable(couponId)
	}

	@Delete(':id/destroy')
	// @Auth(EmployeeRole.ADMIN)
	async delete(@Param('id', ObjectIdValidatePine) couponId: string) {
		return await this.couponService.enable(couponId)
	}
}
