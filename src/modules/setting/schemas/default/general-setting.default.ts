import { ContactType } from '@/constants'
import { GeneralSetting } from '../general-setting.schema'

export const generalDefault: Partial<GeneralSetting> = {
	brandName: 'The Coder House',
	address: '1 Vo Van Ngan Street',
	country: 'Vietnam',
	storeContact: '0987654321',
	contact: [
		{ name: 'Tổng đài', type: ContactType.PHONE_NUMBER, info: '0987654321' },
		{ name: 'Email', type: ContactType.EMAIL, info: 'example@gmail.com' },
		{ name: 'Website', type: ContactType.WEBSITE, info: 'http://example.com' },
		{ name: 'Facebook', type: ContactType.WEBSITE, info: 'facebook.com/1234' },
	],
}
