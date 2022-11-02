import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'
import { DatabaseConnectionName, SettingType } from '@/constants'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Setting, SettingDocument } from '../schemas/setting.schema'

@Injectable()
export class SettingService {
	constructor(
		@InjectModel(Setting.name, DatabaseConnectionName.DATA)
		private readonly settingModel: Model<SettingDocument>
	) {}

	async initAppSetting(settingType: SettingType): Promise<Setting> {
		try {
			return await this.settingModel.create({ type: settingType })
		} catch (err) {
			if (DuplicateKeyException.check(err)) throw new DuplicateKeyException(err)
			throw err
		}
	}
}
