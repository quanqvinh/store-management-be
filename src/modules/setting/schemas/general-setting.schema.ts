import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ContactType, SettingType } from '@/constants'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { generalDefault } from './default/general-setting.default'

export type VirtualData = {
	variables: {
		brandName: string
		address: string
		country: string
	}
}

export type GeneralSettingDocument = Document & GeneralSetting & VirtualData

type Contact = {
	name: string
	type: string
	info: string
}
const ContactDefine = {
	name: { type: String, required: true },
	type: { type: String, enum: Object.keys(ContactType), default: 'other' },
	info: { type: String, required: true },
}

@Schema({
	versionKey: false,
	toObject: { virtuals: true },
	toJSON: { virtuals: true },
})
export class GeneralSetting {
	type: SettingType.GENERAL

	@Prop({ type: String, default: generalDefault.brandName })
	brandName: string

	@Prop({ type: String, default: generalDefault.address })
	address: string

	@Prop({ type: String, default: generalDefault.country })
	country: string

	@Prop({ type: [ContactDefine] })
	contact: Array<Contact>
}

export const GeneralSettingSchema = SchemaFactory.createForClass(GeneralSetting)

GeneralSettingSchema.plugin(mongooseLeanVirtuals)

GeneralSettingSchema.virtual('variables').get(function () {
	return {
		brandName: this.brandName,
		address: this.address,
		country: this.country,
	}
})
