import { DatabaseConnectionName, SettingType } from '@/constants'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { GeneralSetting, GeneralSettingDocument } from '../schemas'
import { SettingService } from './setting.service'

@Injectable()
export class GeneralService {
	constructor(
		@InjectModel(SettingType.GENERAL, DatabaseConnectionName.DATA)
		private readonly generalModel: Model<GeneralSettingDocument>,
		private settingService: SettingService
	) {
		this.settingService
			.initAppSetting(SettingType.GENERAL)
			.then(document => {
				if (document)
					Logger.debug(
						'Init general setting document successful',
						'SettingCollection'
					)
				else
					Logger.debug('General setting document existed', 'SettingCollection')
			})
			.catch(err =>
				Logger.error('Init general setting error\n' + err, 'SettingCollection')
			)
	}

	async initSetting(): Promise<GeneralSetting> {
		return (await this.settingService.initAppSetting(
			SettingType.MEMBER_APP
		)) as GeneralSetting
	}

	async getVariables(): Promise<Record<string, string | number | boolean>> {
		const appVariables = await this.generalModel
			.findOne({ type: SettingType.GENERAL })
			.lean({ virtuals: true })
			.exec()
		return appVariables?.variables
	}

	async get(project = ''): Promise<GeneralSetting> {
		return await this.generalModel
			.findOne()
			.select(project + ' -_id')
			.lean({ virtuals: true })
			.exec()
	}
}
