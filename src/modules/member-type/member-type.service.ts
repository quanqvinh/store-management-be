import { DatabaseConnectionName } from '@/constants'
import { File } from '@/types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MemberAppService } from '../setting/services/member-app.service'
import { CreateMemberTypeDto } from './dto/create-member-type.dto'
import { MemberType, MemberTypeDocument } from './schemas/member-type.schema'

@Injectable()
export class MemberTypeService {
	constructor(
		@InjectModel(MemberType.name, DatabaseConnectionName.DATA)
		private readonly memberTypeModel: Model<MemberTypeDocument>,
		private memberAppService: MemberAppService
	) {}

	async create(dto: CreateMemberTypeDto, icon: File, background: File) {
		const { name, color } = dto
		let { rank, condition, coefficientPoint } = dto

		rank = rank ?? (await this.memberTypeModel.estimatedDocumentCount().exec())

		if (rank > 0 && (!condition || !coefficientPoint)) {
			const latestRank = await this.memberTypeModel
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
			const defaultDisplay = (await this.memberAppService.get('memberType'))
				?.memberType.defaultDisplay
			display = {
				color: color ?? defaultDisplay.color,
				icon: icon?.id ?? defaultDisplay.icon,
				background: background?.id ?? defaultDisplay.background,
			}
		}

		return await this.memberTypeModel.create({
			name,
			rank,
			condition,
			coefficientPoint,
			display,
		})
	}

	async getOne({
		id,
		rank,
	}: {
		id?: string
		rank?: number
	}): Promise<MemberType> {
		return await this.memberTypeModel
			.findOne({ $or: [{ _id: id }, { rank }] })
			.exec()
	}
}
