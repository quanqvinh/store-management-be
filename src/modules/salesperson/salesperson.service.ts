import { CreateSalespersonDto } from './dto/create-salesperson.dto'
import { HashService } from '@/common/providers/hash.service'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Salesperson, SalespersonDocument } from './schemas/salesperson.schema'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { UpdateResult, DeleteResult } from 'mongodb'
import { NotFoundDataException } from '@/common/exceptions/http'
import { UserRole } from '@/constants'
import { UpdateSalespersonInfoDto } from './dto'

@Injectable()
export class SalespersonService {
	constructor(
		@InjectModel(Salesperson.name)
		private salespersonModel: Model<SalespersonDocument>,
		private hashService: HashService
	) {}

	async findAll(): Promise<Salesperson[]> {
		return await this.salespersonModel
			.find({ role: UserRole.SALESPERSON })
			.select('-auth.password -auth.validTokenTime')
			.lean()
			.exec()
	}

	async findById(id: string): Promise<Salesperson> {
		return await this.salespersonModel
			.findOne({ role: UserRole.SALESPERSON, _id: id })
			.select('-auth.password -auth.validTokenTime')
			.lean()
			.exec()
	}

	async findByEmail(email: string): Promise<Salesperson> {
		return await this.salespersonModel
			.findOne({ role: UserRole.SALESPERSON, email })
			.select('-auth.password -auth.validTokenTime')
			.lean()
			.exec()
	}

	async findByUsername(
		username: string,
		isLogin = false
	): Promise<Salesperson> {
		return await this.salespersonModel
			.findOne({ role: UserRole.SALESPERSON, username })
			.select(`${isLogin ? '' : '-auth.password '}-auth.validTokenTime`)
			.lean()
			.exec()
	}

	async create(dto: CreateSalespersonDto): Promise<any> {
		const existedSalesperson = await this.salespersonModel
			.findOne({
				role: UserRole.SALESPERSON,
				$or: [{ email: dto.email }, { username: dto.username }],
			})
			.lean()
			.exec()
		if (existedSalesperson) {
			if (existedSalesperson.email === dto.email)
				throw new DuplicateKeyException('email')
			else throw new DuplicateKeyException('username')
		}
		dto.password = this.hashService.hash(dto.password)
		return await this.salespersonModel.create({
			...(dto as Omit<CreateSalespersonDto, 'password'>),
			role: UserRole.SALESPERSON,
			auth: { password: dto.password },
		})
	}

	async updateInfo(
		userId: string,
		dto: UpdateSalespersonInfoDto
	): Promise<UpdateResult> {
		const existedSalesperson = await this.salespersonModel
			.findOne({
				role: UserRole.SALESPERSON,
				$or: [{ email: dto.email }, { username: dto.username }],
			})
			.lean()
			.exec()
		if (!existedSalesperson) {
			if (existedSalesperson.email === dto.email)
				throw new DuplicateKeyException('email')
			else throw new DuplicateKeyException('username')
		}
		return await this.salespersonModel
			.updateOne({ _id: userId, role: UserRole.SALESPERSON }, dto)
			.exec()
	}

	async delete(userId: string): Promise<DeleteResult> {
		const existedSalesperson = await this.salespersonModel
			.findOne({ _id: userId, role: UserRole.SALESPERSON })
			.lean()
			.exec()
		if (!existedSalesperson) throw new NotFoundDataException('Salesperson')
		return await this.salespersonModel
			.deleteOne({ _id: userId, role: UserRole.SALESPERSON })
			.exec()
	}
}
