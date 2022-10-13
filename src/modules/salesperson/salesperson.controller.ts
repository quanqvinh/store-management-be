import {
	NotFoundDataException,
	NotMatchedDataException,
} from '@/common/exceptions/http'
import { Controller, Post, Get, Patch, Delete } from '@nestjs/common'
import { Body, Param } from '@nestjs/common/decorators'
import { SalespersonService } from './salesperson.service'
import {
	CreateSalespersonDto,
	CreateSalespersonSchema,
	UpdateSalespersonInfoDto,
	UpdateSalespersonInfoSchema,
	SalespersonInfoDto,
} from './dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import {
	ObjectIdValidatePine,
	JoiValidatePine,
	EmailValidatePipe,
	UsernameValidatePipe,
} from '@/common/pipes'
import { WriteResponse } from '@/types'
import { JwtAccessTokenGuard } from '@/common/decorators/bearer-token.decorator'

@Controller('salesperson')
@ApiTags('salesperson')
export class SalespersonController {
	constructor(private readonly salespersonService: SalespersonService) {}

	@Get('list')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: [SalespersonInfoDto] })
	async getAllSalesperson(): Promise<SalespersonInfoDto[]> {
		return (await this.salespersonService.findAll()).map(admin => {
			const { auth, ...insensitiveData } = admin
			return {
				...insensitiveData,
				isVerified: auth.isVerified,
			}
		})
	}

	@Get('id/:id')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: SalespersonInfoDto })
	async getMemberById(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<SalespersonInfoDto> {
		const member = await this.salespersonService.findById(id)
		if (!member) throw new NotFoundDataException('Member')
		const { auth, ...insensitiveData } = member
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Get('email/:email')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: SalespersonInfoDto })
	async getMemberByEmail(
		@Param('email', EmailValidatePipe) email: string
	): Promise<SalespersonInfoDto> {
		const member = await this.salespersonService.findByEmail(email)
		if (!member) throw new NotFoundDataException('Member')
		const { auth, ...insensitiveData } = member
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Get('username/:username')
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 200, type: SalespersonInfoDto })
	async getMemberByUsername(
		@Param('username', UsernameValidatePipe) username: string
	): Promise<SalespersonInfoDto> {
		const member = await this.salespersonService.findByEmail(username)
		if (!member) throw new NotFoundDataException('Member')
		const { auth, ...insensitiveData } = member
		return {
			...insensitiveData,
			isVerified: auth.isVerified,
		}
	}

	@Post()
	@JwtAccessTokenGuard()
	@ApiResponse({ status: 201, type: SalespersonInfoDto })
	async create(
		@Body(new JoiValidatePine(CreateSalespersonSchema))
		dto: CreateSalespersonDto
	): Promise<SalespersonInfoDto> {
		try {
			const member = await this.salespersonService.create(dto)
			const { auth, ...insensitiveData } = member?._doc
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
		@Body(new JoiValidatePine(UpdateSalespersonInfoSchema))
		dto: UpdateSalespersonInfoDto
	): Promise<WriteResponse> {
		const updateResult = await this.salespersonService.updateInfo(id, dto)
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
		const deleteResult = await this.salespersonService.delete(id)
		return { isSuccess: deleteResult.deletedCount > 0 }
	}
}
