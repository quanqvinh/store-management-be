import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	BadRequestException,
} from '@nestjs/common'
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

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('list')
	async getAllUser(): Promise<User[]> {
		return await this.userService.findAll()
	}

	@Get('id/:id')
	async getUserById(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<User> {
		const user = await this.userService.findById(id)
		if (!user) throw new BadRequestException('User not found')
		return user
	}

	@Get('un/:username')
	async getUser(
		@Param('username', UsernameValidatePipe) username: string
	): Promise<User> {
		const user = await this.userService.findByUsername(username)
		if (!user) throw new BadRequestException('User not found')
		return user
	}

	@Post()
	async create(
		@Body(new JoiValidatePine(CreateUserSchema)) payload: CreateUserDto
	): Promise<User> {
		try {
			return await this.userService.create(payload)
		} catch (error) {
			console.log('Error ne', { ...error })
			throw error
		}
	}

	@Patch(':id')
	async updateInfo(
		@Param('id', ObjectIdValidatePine) id: string,
		@Body(new JoiValidatePine(UpdateUserSchema)) payload: UpdateUserInfoDto
	): Promise<boolean> {
		const updateResult = await this.userService.updateInfo(id, payload)
		if (updateResult.matchedCount === 0)
			throw new BadRequestException("Id don't match any data")
		return updateResult.modifiedCount === updateResult.matchedCount
	}

	@Delete(':id')
	async delete(
		@Param('id', ObjectIdValidatePine) id: string
	): Promise<boolean> {
		const deleteResult = await this.userService.delete(id)
		return deleteResult.deletedCount > 0
	}
}
