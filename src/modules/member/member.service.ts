import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Member, MemberDocument } from './schemas/member.schema'
import { CreateMemberDto, UpdateMemberInfoDto } from './dto'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { HashService } from '@/common/providers/hash.service'
import { UpdateResult, DeleteResult } from 'mongodb'
import { NotFoundDataException } from '@/common/exceptions/http'

@Injectable()
export class MemberService {
	constructor(
		@InjectModel(Member.name) private memberModel: Model<MemberDocument>,
		private hashService: HashService
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
		return await this.memberModel
			.findOne({ role: Member.name, email })
			.lean()
			.exec()
	}

	async findByMobile(mobile: string): Promise<Member> {
		return await this.memberModel
			.findOne({ role: Member.name, mobile })
			.lean()
			.exec()
	}

	async create(dto: CreateMemberDto): Promise<any> {
		const existedMember = await this.memberModel
			.findOne({
				role: Member.name,
				$or: [{ email: dto.email }, { mobile: dto.mobile }],
			})
			.lean()
			.exec()
		if (existedMember) {
			if (existedMember.email === dto.email)
				throw new DuplicateKeyException('email')
			else throw new DuplicateKeyException('mobile')
		}
		dto.password = this.hashService.hash(dto.password)
		return await this.memberModel.create({
			...(dto as Omit<CreateMemberDto, 'password'>),
			auth: { password: dto.password },
		})
	}

	async updateInfo(
		userId: string,
		dto: UpdateMemberInfoDto
	): Promise<UpdateResult> {
		const existedMember = await this.memberModel
			.findOne({
				role: Member.name,
				$or: [{ email: dto.email }, { mobile: dto.mobile }],
			})
			.lean()
			.exec()
		if (!existedMember) {
			if (existedMember.email === dto.email)
				throw new DuplicateKeyException('email')
			else throw new DuplicateKeyException('mobile')
		}
		return await this.memberModel
			.updateOne({ _id: userId, role: Member.name }, dto)
			.exec()
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
