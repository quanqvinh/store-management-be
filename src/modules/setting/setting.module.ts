import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { Setting, SettingSchema } from './schemas/setting.schema'
import { MemberAppSettingSchema } from './schemas/member-app-setting.schema'
import { MemberAppController } from './controllers/member-app.controller'
import { MemberAppService } from './services/member-app.service'
import { GeneralSettingSchema } from './schemas/general-setting.schema'
import { DatabaseConnectionName, SettingType } from '@/constants'
import { SettingService } from './services/setting.service'
import { GeneralService } from './services/general.service'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: Setting.name,
					schema: SettingSchema,
					discriminators: [
						{ name: SettingType.GENERAL, schema: GeneralSettingSchema },
						{ name: SettingType.MEMBER_APP, schema: MemberAppSettingSchema },
					],
				},
			],
			DatabaseConnectionName.DATA
		),
	],
	controllers: [MemberAppController],
	providers: [SettingService, MemberAppService, GeneralService],
	exports: [MemberAppService, GeneralService],
})
export class SettingModule {}
