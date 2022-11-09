import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Member, MemberDocument } from './schemas/member.schema'
import { CreateMemberDto, UpdateMemberInfoDto } from './dto'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { UpdateResult, DeleteResult } from 'mongodb'
import { NotFoundDataException } from '@/common/exceptions/http'
import { DatabaseConnectionName } from '@/constants'
import { stringToDate } from '@/utils'

@Injectable()
export class MemberService {
	constructor(
		@InjectModel(Member.name, DatabaseConnectionName.DATA)
		public memberModel: Model<MemberDocument>
	) {}

	async findAll(): Promise<Member[]> {
		return await this.memberModel.find({ role: Member.name }).lean().exec()
	}

	async findById(id: string): Promise<Member> {
		return await this.memberModel
			.findOne({ role: Member.name, _id: id })
			.lean()
			.exec()
	}

	async findByEmail(email: string): Promise<Member> {
		return await this.memberModel.findOne({ email }).lean().exec()
	}

	async create(dto: CreateMemberDto, memberTypeId: string): Promise<Member> {
		try {
			const code = 'M' + Math.floor(Date.now() / 1000)
			const dob = stringToDate(dto.dob)
			dto.dob = undefined
			return await this.memberModel.create({
				...dto,
				code,
				dob,
				memberInfo: { memberType: memberTypeId },
			})
		} catch (err) {
			if (DuplicateKeyException.check(err)) throw new DuplicateKeyException(err)
			throw err
		}
	}

	async updateInfo(
		userId: string,
		dto: UpdateMemberInfoDto
	): Promise<UpdateResult> {
		try {
			return await this.memberModel
				.updateOne({ _id: userId, role: Member.name }, dto)
				.exec()
		} catch (err) {
			if (DuplicateKeyException.check(err)) throw new DuplicateKeyException(err)
			throw err
		}
	}

	async delete(userId: string): Promise<DeleteResult> {
		const existedMember = await this.memberModel
			.findOne({ _id: userId, role: Member.name })
			.lean()
			.exec()
		if (!existedMember) throw new NotFoundDataException('Member')
		return await this.memberModel
			.deleteOne({ _id: userId, role: Member.name })
			.exec()
	}
}
