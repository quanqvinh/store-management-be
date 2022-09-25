import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { CreateUserDto, UpdateUserInfoDto } from './dto'
import { DeleteResult, UpdateResult } from 'mongodb'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findAll(): Promise<User[]> {
		return await this.userModel.find({}).lean().exec()
	}

	async findById(id: string): Promise<User> {
		return await this.userModel.findById(id).lean().exec()
	}

	async findByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email }).lean().exec()
	}

	async findByUsername(username: string): Promise<User> {
		return await this.userModel.findOne({ username }).lean().exec()
	}

	async findByMobile(mobile: string): Promise<User> {
		return await this.userModel.findOne({ mobile }).lean().exec()
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const existedUser = await this.userModel.findOne({
			$or: [{ email: createUserDto.email }, { mobile: createUserDto.mobile }],
		})
		if (existedUser) {
			if (existedUser.email === createUserDto.email)
				throw new DuplicateKeyException('email')
			throw new DuplicateKeyException('mobile')
		}
		return await this.userModel.create({
			...createUserDto,
			auth: { password: createUserDto.password },
		})
	}

	async updateInfo(
		userId: string,
		updateUserInfoDto: UpdateUserInfoDto
	): Promise<UpdateResult> {
		const existedUser = await this.userModel.findOne({
			$or: [
				{ email: updateUserInfoDto.email },
				{ mobile: updateUserInfoDto.mobile },
				{ username: updateUserInfoDto.username },
			],
		})
		if (existedUser) {
			if (existedUser.email === existedUser.email)
				throw new DuplicateKeyException('email')
			else if (existedUser.mobile === existedUser.mobile)
				throw new DuplicateKeyException('mobile')
			throw new DuplicateKeyException('username')
		}
		return await this.userModel
			.updateOne({ _id: userId }, updateUserInfoDto)
			.exec()
	}

	async delete(id: string): Promise<DeleteResult> {
		return await this.userModel.deleteOne({ _id: id })
	}
}
