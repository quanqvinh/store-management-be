import { UpdateResult } from 'mongodb'
import { DatabaseConnectionName, SettingType } from '@/constants'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
	MemberAppSetting,
	MemberAppSettingDocument,
} from '../schemas/member-app-setting.schema'
import { SettingService } from './setting.service'

@Injectable()
export class MemberAppService {
	constructor(
		@InjectModel(SettingType.MEMBER_APP, DatabaseConnectionName.DATA)
		private readonly memberAppModel: Model<MemberAppSettingDocument>,
		private settingService: SettingService
	) {
		this.settingService
			.initAppSetting(SettingType.MEMBER_APP)
			.then(document => {
				if (document)
					Logger.debug(
						'Init member app setting document successful',
						'SettingCollection'
					)
				else
					Logger.debug(
						'Member app setting document existed',
						'SettingCollection'
					)
			})
			.catch(err =>
				Logger.error(
					'Init member app setting error\n' + err,
					'SettingCollection'
				)
			)
	}

	async initSetting(): Promise<MemberAppSetting> {
		return (await this.settingService.initAppSetting(
			SettingType.MEMBER_APP
		)) as MemberAppSetting
	}

	async updateOtpMailTemplate(script: string): Promise<UpdateResult> {
		return await this.memberAppModel.updateOne(
			{ type: SettingType.MEMBER_APP },
			{
				$set: { 'templates.otpMail.script': script },
			}
		)
	}

	async get(project = '') {
		return await this.memberAppModel
			.findOne()
			.select(project)
			.lean({ virtuals: true })
			.exec()
	}
}
