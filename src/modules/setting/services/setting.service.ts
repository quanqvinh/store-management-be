import { GeneralSettingDocument } from '@/modules/setting/schemas/general-setting.schema'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { DatabaseConnectionName, SettingType } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Setting, SettingDocument } from '../schemas/setting.schema'
import { MemberAppSettingDocument } from '../schemas/member-app-setting.schema'

@Injectable()
export class SettingService {
	constructor(
		@InjectModel(Setting.name, DatabaseConnectionName.DATA)
		private readonly settingModel: Model<SettingDocument>,
		@InjectModel(SettingType.GENERAL, DatabaseConnectionName.DATA)
		private readonly generalSettingModel: Model<GeneralSettingDocument>,
		@InjectModel(SettingType.MEMBER_APP, DatabaseConnectionName.DATA)
		private readonly memberAppSettingModel: Model<MemberAppSettingDocument>
	) {}

	async initAppSetting(type: SettingType): Promise<Setting> {
		try {
			const checkExist = await this.settingModel.count({ type }).lean().exec()
			if (checkExist > 0) return

			if (type === SettingType.GENERAL) {
				return await this.generalSettingModel.create({
					type: SettingType.GENERAL,
				})
			} else if (type === SettingType.MEMBER_APP) {
				return await this.memberAppSettingModel.create({
					type: SettingType.MEMBER_APP,
				})
			}
		} catch (err) {
			if (DuplicateKeyException.check(err)) throw new DuplicateKeyException(err)
			throw err
		}
	}
}
