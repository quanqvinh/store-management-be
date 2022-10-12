import {
	NotFoundDataException,
	NotMatchedDataException,
} from '@/common/exceptions/http'
import { Controller, Post, Get, Patch, Delete } from '@nestjs/common'
import { Body, Param } from '@nestjs/common/decorators'
import {
	CreateAdminDto,
	CreateAdminSchema,
	UpdateAdminInfoDto,
	UpdateAdminInfoSchema,
} from './dto'
import { JwtAccessTokenGuard } from '@/common/decorators/bearer-token.decorator'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminInfoResponse } from './types'
import {
	ObjectIdValidatePine,
	JoiValidatePine,
	EmailValidatePipe,
	UsernameValidatePipe,
} from '@/common/pipes'
import { WriteResponse } from '@/types'
import { AdminService } from './admin.service'

@Controller('admin')
@ApiTags('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get('all')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: [AdminInfoResponse] })
	async getAllAdmin(): Promise<AdminInfoResponse[]> {
		return (await this.adminService.findAll()).map(admin => {
			const { auth, ...insensitiveData } = admin
			return {
				...insensitiveData,
				isVerified: auth.isVerified,
			}
		})
	}

	@Get('id/:id')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: AdminInfoResponse })
	async getAdminById(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<AdminInfoResponse> {
		const admin = await this.adminService.findById(id)
		if (!admin) throw new NotFoundDataException('Admin')
		const { auth, ...insensitiveData } = admin
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Get('email/:email')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: AdminInfoResponse })
	async getAdminByUsername(
		@Param('email', EmailValidatePipe) email: string
	): Promise<AdminInfoResponse> {
		const admin = await this.adminService.findByEmail(email)
		if (!admin) throw new NotFoundDataException('Admin')
		const { auth, ...insensitiveData } = admin
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Get('username/:username')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: AdminInfoResponse })
	async getAdminByMobile(
		@Param('username', UsernameValidatePipe) username: string
	): Promise<AdminInfoResponse> {
		const admin = await this.adminService.findByUsername(username)
		if (!admin) throw new NotFoundDataException('Admin')
		const { auth, ...insensitiveData } = admin
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Post()
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 201, type: AdminInfoResponse })
	async create(
		@Body(new JoiValidatePine(CreateAdminSchema)) dto: CreateAdminDto
	): Promise<AdminInfoResponse> {
		try {
			const admin = await this.adminService.create(dto)
			const { auth, ...insensitiveData } = admin?._doc
			return {
				...insensitiveData,
				isVerified: auth.isVerified,
			}
		} catch (error) {
			throw error
		}
	}

	@Patch(':id')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: WriteResponse })
	async updateInfo(
		@Param('id', ObjectIdValidatePine) id: string,
		@Body(new JoiValidatePine(UpdateAdminInfoSchema)) dto: UpdateAdminInfoDto
	): Promise<WriteResponse> {
		const updateResult = await this.adminService.updateInfo(id, dto)
		if (updateResult.matchedCount === 0) throw new NotMatchedDataException()
		return {
			isSuccess: updateResult.modifiedCount === updateResult.matchedCount,
		}
	}

	@Delete(':id')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: WriteResponse })
	async delete(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<WriteResponse> {
		const deleteResult = await this.adminService.delete(id)
		return { isSuccess: deleteResult.deletedCount > 0 }
	}
}
