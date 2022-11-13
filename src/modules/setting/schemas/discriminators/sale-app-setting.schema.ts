import { Setting } from './..'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { SettingType } from '@/constants'

export type SaleAppSettingDocument = Document & SaleAppSetting

@Schema({ versionKey: false })
export class SaleAppSetting extends Setting {
	type: SettingType.SALE_APP

	@Prop({ type: String })
	appName: string
}

export const SaleAppSettingSchema = SchemaFactory.createForClass(SaleAppSetting)
