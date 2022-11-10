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
		image: new Types.ObjectId('6362998afb902efd814ea1d1'),
		content: '{{firstName}} ơi, Hi-Tea đi!',
	},
}
