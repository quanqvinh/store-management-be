import { Setting } from './setting.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { SettingType } from '@/constants'

export type AdminAppSettingDocument = Document & AdminAppSetting

@Schema({ versionKey: false })
export class AdminAppSetting extends Setting {
	type: SettingType.ADMIN_APP

	@Prop({ type: String })
	appName: string
}

export const AdminAppSettingSchema =
	SchemaFactory.createForClass(AdminAppSetting)
