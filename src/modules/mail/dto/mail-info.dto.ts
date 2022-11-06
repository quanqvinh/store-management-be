import { TemplateData } from '@/types'

export class MailInfoDto<T extends string = string> {
	recipient: string
	content: {
		data: TemplateData<T>
		subject: string
		body: string
	}
}
