import { HashService } from '@/common/providers/hash.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Admin, AdminDocument } from './schemas/admin.schema'
import { CreateAdminDto, UpdateAdminInfoDto } from './dto'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { UpdateResult, DeleteResult } from 'mongodb'
import { NotFoundDataException } from '@/common/exceptions/http'
import { UserRole } from '@/constants'

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
		private hashService: HashService
	) {}

	async findAll(): Promise<Admin[]> {
		return await this.adminModel.find({ role: UserRole.ADMIN }).lean().exec()
	}

	async findById(id: string): Promise<Admin> {
		return await this.adminModel
			.findOne({ role: UserRole.ADMIN, _id: id })
			.lean()
			.exec()
	}

	async findByEmail(email: string): Promise<Admin> {
		return await this.adminModel
			.findOne({ role: UserRole.ADMIN, email })
			.lean()
			.exec()
	}

	async findByUsername(username: string): Promise<Admin> {
		return await this.adminModel
			.findOne({ role: UserRole.ADMIN, username })
			.lean()
			.exec()
	}

	async create(dto: CreateAdminDto): Promise<Admin> {
		const existedAdmin = await this.adminModel
			.findOne({
				role: UserRole.ADMIN,
				$or: [{ email: dto.email }, { username: dto.username }],
			})
			.lean()
			.exec()
		if (existedAdmin) {
			if (existedAdmin.email === dto.email)
				throw new DuplicateKeyException('email')
			else throw new DuplicateKeyException('username')
		}
		dto.password = this.hashService.hash(dto.password)
		return await this.adminModel.create({
			...(dto as Omit<CreateAdminDto, 'password'>),
			role: UserRole.ADMIN,
			auth: { password: dto.password },
		})
	}

	async updateInfo(
		userId: string,
		dto: UpdateAdminInfoDto
	): Promise<UpdateResult> {
		const existedAdmin = await this.adminModel
			.findOne({
				role: UserRole.ADMIN,
				$or: [{ email: dto.email }, { mobile: dto.username }],
			})
			.lean()
			.exec()
		if (!existedAdmin) {
			if (existedAdmin.email === dto.email)
				throw new DuplicateKeyException('email')
			else throw new DuplicateKeyException('username')
		}
		return await this.adminModel
			.updateOne({ _id: userId, role: UserRole.ADMIN }, dto)
			.exec()
	}

	async delete(userId: string): Promise<DeleteResult> {
		const existedAdmin = await this.adminModel
			.findOne({ _id: userId, role: UserRole.ADMIN })
			.lean()
			.exec()
		if (!existedAdmin) throw new NotFoundDataException('Admin')
		return await this.adminModel
			.deleteOne({ _id: userId, role: UserRole.ADMIN })
			.exec()
	}
}
