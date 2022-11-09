import { Types } from 'mongoose'
import { MemberAppSetting } from '../member-app-setting.schema'

export const memberAppDefault: Partial<MemberAppSetting> = {
	memberType: {
		defaultDisplay: {
			icon: new Types.ObjectId('6368089879ac2a5f1be87689'),
			color: '#fff',
			background: new Types.ObjectId('6368092779ac2a5f1be8768b'),
		},
	},
}
