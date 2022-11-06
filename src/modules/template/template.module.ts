import { DatabaseConnectionName, TemplateType } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Template, TemplateSchema } from './schemas/template.schema'
import { MailTemplateSchema } from './schemas/mail-template.schema'
import { NotificationTemplateSchema } from './schemas/notification-template.schema'
import { TemplateService } from './services/template.service'
import { SettingModule } from '../setting/setting.module'
import { MailTemplateService } from './services/mail-template.service'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: Template.name,
					schema: TemplateSchema,
					discriminators: [
						{ name: TemplateType.MAIL, schema: MailTemplateSchema },
						{
							name: TemplateType.NOTIFICATION,
							schema: NotificationTemplateSchema,
						},
					],
				},
			],
			DatabaseConnectionName.DATA
		),
		SettingModule,
	],
	providers: [TemplateService, MailTemplateService],
	exports: [TemplateService, MailTemplateService],
})
export class TemplateModule {}
