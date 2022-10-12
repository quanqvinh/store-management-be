import { HashService } from '@/common/providers/hash.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Salesperson, SalespersonDocument } from './schemas/salesperson.schema'
// import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
// import { UpdateResult, DeleteResult } from 'mongodb'
// import { NotFoundDataException } from '@/common/exceptions/http'
import { UserRole } from '@/constants'

@Injectable()
export class SalespersonService {
	constructor(
		@InjectModel(Salesperson.name)
		private adminModel: Model<SalespersonDocument>,
		private hashService: HashService
	) {}

	async findAll(): Promise<Salesperson[]> {
		return await this.adminModel
			.find({ role: UserRole.SALESPERSON })
			.select('-auth.password -auth.validTokenTime')
			.lean()
			.exec()
	}

	async findById(id: string): Promise<Salesperson> {
		return await this.adminModel
			.findOne({ role: UserRole.SALESPERSON, _id: id })
			.select('-auth.password -auth.validTokenTime')
			.lean()
			.exec()
	}

	async findByEmail(email: string): Promise<Salesperson> {
		return await this.adminModel
			.findOne({ role: UserRole.SALESPERSON, email })
			.select('-auth.password -auth.validTokenTime')
			.lean()
			.exec()
	}

	async findByUsername(
		username: string,
		isLogin = false
	): Promise<Salesperson> {
		return await this.adminModel
			.findOne({ role: UserRole.SALESPERSON, username })
			.select(`${isLogin ? '' : '-auth.password '}-auth.validTokenTime`)
			.lean()
			.exec()
	}

	// async create(dto: CreateAdminDto): Promise<Admin> {
	// 	const existedAdmin = await this.adminModel
	// 		.findOne({
	// 			role: UserRole.ADMIN,
	// 			$or: [{ email: dto.email }, { username: dto.username }],
	// 		})
	// 		.lean()
	// 		.exec()
	// 	if (existedAdmin) {
	// 		if (existedAdmin.email === dto.email)
	// 			throw new DuplicateKeyException('email')
	// 		else throw new DuplicateKeyException('username')
	// 	}
	// 	dto.password = this.hashService.hash(dto.password)
	// 	return await this.adminModel.create({
	// 		...(dto as Omit<CreateAdminDto, 'password'>),
	// 		role: UserRole.ADMIN,
	// 		auth: { password: dto.password },
	// 	})
	// }

	// async updateInfo(
	// 	userId: string,
	// 	dto: UpdateAdminInfoDto
	// ): Promise<UpdateResult> {
	// 	const existedAdmin = await this.adminModel
	// 		.findOne({
	// 			role: UserRole.ADMIN,
	// 			$or: [{ email: dto.email }, { mobile: dto.username }],
	// 		})
	// 		.lean()
	// 		.exec()
	// 	if (!existedAdmin) {
	// 		if (existedAdmin.email === dto.email)
	// 			throw new DuplicateKeyException('email')
	// 		else throw new DuplicateKeyException('username')
	// 	}
	// 	return await this.adminModel
	// 		.updateOne({ _id: userId, role: UserRole.ADMIN }, dto)
	// 		.exec()
	// }

	// async delete(userId: string): Promise<DeleteResult> {
	// 	const existedAdmin = await this.adminModel
	// 		.findOne({ _id: userId, role: UserRole.ADMIN })
	// 		.lean()
	// 		.exec()
	// 	if (!existedAdmin) throw new NotFoundDataException('Admin')
	// 	return await this.adminModel
	// 		.deleteOne({ _id: userId, role: UserRole.ADMIN })
	// 		.exec()
	// }
}