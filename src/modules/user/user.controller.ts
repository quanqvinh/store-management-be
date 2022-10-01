import { NotMatchedDataException } from '@/common/exceptions/http/not-found.exception'
import { NotFoundDataException } from '@/common/exceptions/http'
import { Controller, Post, Get, Patch, Delete, UseGuards } from '@nestjs/common'
import { Body, Param } from '@nestjs/common/decorators'
import { User } from './schemas/user.schema'
import { UserService } from './user.service'
import { ObjectIdValidatePine, JoiValidatePine } from '@/common/pipes'
import {
	CreateUserDto,
	CreateUserSchema,
	UpdateUserInfoDto,
	UpdateUserSchema,
} from './dto'
import UsernameValidatePipe from './pipes/username-validate.pipe'
import { JwtAccessGuard } from '@/common/guards/jwt-auth.guard'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAccessGuard)
	@Get('list')
	async getAllUser(): Promise<User[]> {
		return await this.userService.findAll()
	}

	@UseGuards(JwtAccessGuard)
	@Get('id/:id')
	async getUserById(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<User> {
		const user = await this.userService.findById(id)
		if (!user) throw new NotFoundDataException('User')
		return user
	}

	@UseGuards(JwtAccessGuard)
	@Get('un/:username')
	async getUser(
		@Param('username', UsernameValidatePipe) username: string
	): Promise<User> {
		const user = await this.userService.findByUsername(username)
		if (!user) throw new NotFoundDataException('User')
		return user
	}

	@UseGuards(JwtAccessGuard)
	@Post()
	async create(
		@Body(new JoiValidatePine(CreateUserSchema)) payload: CreateUserDto
	): Promise<User> {
		try {
			return await this.userService.create(payload)
		} catch (error) {
			throw error
		}
	}

	@UseGuards(JwtAccessGuard)
	@Patch(':id')
	async updateInfo(
		@Param('id', ObjectIdValidatePine) id: string,
		@Body(new JoiValidatePine(UpdateUserSchema)) payload: UpdateUserInfoDto
	): Promise<boolean> {
		const updateResult = await this.userService.updateInfo(id, payload)
		if (updateResult.matchedCount === 0) throw new NotMatchedDataException()
		return updateResult.modifiedCount === updateResult.matchedCount
	}

	@UseGuards(JwtAccessGuard)
	@Delete(':id')
	async delete(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<boolean> {
		const deleteResult = await this.userService.delete(id)
		return deleteResult.deletedCount > 0
	}
}
