import {
	NotFoundDataException,
	NotMatchedDataException,
} from '@/common/exceptions/http'
import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { Body, Param } from '@nestjs/common/decorators'
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import {
	CreateAdminDto,
	CreateAdminSchema,
	UpdateAdminInfoDto,
	UpdateAdminInfoSchema,
} from './dto'
import { JwtAccessGuard } from '@/common/guards/jwt-auth.guard'
import { ApiTagsAndBearer } from '@/common/decorators/api-tag-and-bearer.decorator'
import { ApiResponse } from '@nestjs/swagger'
import { Admin } from './schemas/admin.schema'
import {
	ObjectIdValidatePine,
	JoiValidatePine,
	EmailValidatePipe,
	MobileValidatePipe,
} from '@/common/pipes'
import { ResponseData } from '@/types'
import { AdminService } from './admin.service'

@ApiTagsAndBearer('admin')
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@UseInterceptors(TransformInterceptor<Admin[]>)
	@UseGuards(JwtAccessGuard)
	@Get('list')
	@ApiResponse({ status: 200, type: ResponseData<Admin[]> })
	async getAllAdmin(): Promise<Admin[]> {
		return await this.adminService.findAll()
	}

	@UseInterceptors(TransformInterceptor<Admin>)
	@UseGuards(JwtAccessGuard)
	@Get('id/:id')
	@ApiResponse({ status: 200, type: ResponseData<Admin> })
	async getAdminById(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<Admin> {
		const admin = await this.adminService.findById(id)
		if (!admin) throw new NotFoundDataException('Admin')
		return admin
	}

	@UseInterceptors(TransformInterceptor<Admin>)
	@UseGuards(JwtAccessGuard)
	@Get('email/:email')
	@ApiResponse({ status: 200, type: ResponseData<Admin> })
	async getAdminByUsername(@Param('email', EmailValidatePipe) email: string) {
		const admin = await this.adminService.findByEmail(email)
		if (!admin) throw new NotFoundDataException('Admin')
		return admin
	}

	@UseInterceptors(TransformInterceptor<Admin>)
	@UseGuards(JwtAccessGuard)
	@Get('mobile/:mobile')
	@ApiResponse({ status: 200, type: Admin })
	async getAdminByMobile(@Param('mobile', MobileValidatePipe) mobile: string) {
		const Admin = await this.adminService.findByEmail(mobile)
		if (!Admin) throw new NotFoundDataException('Admin')
		return Admin
	}

	@UseInterceptors(TransformInterceptor<Admin>)
	// @UseGuards(JwtAccessGuard)
	@Post()
	@ApiResponse({ status: 201, type: Admin })
	async create(
		@Body(new JoiValidatePine(CreateAdminSchema)) dto: CreateAdminDto
	): Promise<Admin> {
		try {
			return await this.adminService.create(dto)
		} catch (error) {
			throw error
		}
	}

	@UseGuards(JwtAccessGuard)
	@Patch(':id')
	async updateInfo(
		@Param('id', ObjectIdValidatePine) id: string,
		@Body(new JoiValidatePine(UpdateAdminInfoSchema)) dto: UpdateAdminInfoDto
	): Promise<boolean> {
		const updateResult = await this.adminService.updateInfo(id, dto)
		if (updateResult.matchedCount === 0) throw new NotMatchedDataException()
		return updateResult.modifiedCount === updateResult.matchedCount
	}

	@UseGuards(JwtAccessGuard)
	@Delete(':id')
	async delete(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<boolean> {
		const deleteResult = await this.adminService.delete(id)
		return deleteResult.deletedCount > 0
	}
}
