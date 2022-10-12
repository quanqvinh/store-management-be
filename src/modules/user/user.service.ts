import { UserRole } from '../../constants/index'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findAll(role?: UserRole): Promise<User[]> {
		if (role) return await this.userModel.find({ role }).lean().exec()
		return await this.userModel.find().lean().exec()
	}

	async findById(id: string, role?: UserRole): Promise<User> {
		if (role)
			return await this.userModel.findOne({ role, _id: id }).lean().exec()
		return await this.userModel.findOne({ _id: id }).lean().exec()
	}

	async findByEmail<T>(email: string, role: string): Promise<T> {
		return (await this.userModel.findOne({ email, role }).lean().exec()) as T
	}
}
