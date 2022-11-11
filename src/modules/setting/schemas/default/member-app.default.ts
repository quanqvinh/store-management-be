import { Types } from 'mongoose'
import { MemberAppSetting } from '../member-app-setting.schema'

export const memberAppDefault: Partial<MemberAppSetting> = {
	memberRank: {
		defaultDisplay: {
			icon: new Types.ObjectId('6368089879ac2a5f1be87689'),
			color: '#fff',
			background: new Types.ObjectId('6368092779ac2a5f1be8768b'),
		},
	},
	greeting: {
		image: new Types.ObjectId('636aa1004277123fb7e1f32b'),
		content: '{{firstName}} ơi, Hi-Tea đi!',
	},
	defaultImages: {
		product: new Types.ObjectId('636aa1004277123fb7e1f32b'),
		store: new Types.ObjectId('636aa1004277123fb7e1f32b'),
		category: new Types.ObjectId('636aa1004277123fb7e1f32b'),
		coupon: new Types.ObjectId('636aa1004277123fb7e1f32b'),
		couponNotification: new Types.ObjectId('636aa1004277123fb7e1f32b'),
	},
}
