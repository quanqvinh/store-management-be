import { NotFoundDataException } from '@/common/exceptions/http'
import { DatabaseConnectionName } from '@/constants'
import { File } from '@/types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MemberAppService } from '../setting/services/member-app.service'
import { CreateMemberRankDto } from './dto/create-member-rank.dto'
import { MemberRank, MemberRankDocument } from './schemas/member-rank.schema'

@Injectable()
export class MemberRankService {
	constructor(
		@InjectModel(MemberRank.name, DatabaseConnectionName.DATA)
		private readonly memberRankModel: Model<MemberRankDocument>,
		private memberAppService: MemberAppService
	) {}

	async create(dto: CreateMemberRankDto, icon: File, background: File) {
		const { name, color } = dto
		let { rank, condition, coefficientPoint } = dto

		rank = rank ?? (await this.memberRankModel.estimatedDocumentCount().exec())

		if (rank > 0 && (!condition || !coefficientPoint)) {
			const latestRank = await this.memberRankModel
				.findOne({ rank: rank - 1 })
				.select('condition coefficientPoint')
				.lean()
				.exec()
			if (rank > 0) {
				condition = condition ?? latestRank.condition
				coefficientPoint = coefficientPoint ?? latestRank.coefficientPoint
			}
		}

		let display
		if (!icon || !background || !color) {
			const defaultDisplay = (await this.memberAppService.get('memberRank'))
				?.memberRank.defaultDisplay
			display = {
				color: color ?? defaultDisplay.color,
				icon: icon?.id ?? defaultDisplay.icon,
				background: background?.id ?? defaultDisplay.background,
			}
		}

		return await this.memberRankModel.create({
			name,
			rank,
			condition,
			coefficientPoint,
			display,
		})
	}

	async getAllShortData() {
		return await this.memberRankModel
			.find()
			.select('name display rank')
			.sort('rank')
			.lean()
			.exec()
	}

	async getOne({
		id,
		rank,
	}: {
		id?: string
		rank?: number
	}): Promise<MemberRank> {
		return await this.memberRankModel
			.findOne({ $or: [{ _id: id }, { rank }] })
			.orFail(new NotFoundDataException('member rank'))
			.exec()
	}
}
