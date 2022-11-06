import { EditTemplateScriptSchema } from '@/modules/template/dto/edit-template-script.dto'
import { Body, Patch, Post } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { MemberAppService } from '../services/member-app.service'
import { JoiValidatePine } from '@/common/pipes'
import { EditTemplateScriptDto } from '@/modules/template/dto/edit-template-script.dto'

@Controller('setting/member-app')
export class MemberAppController {
	constructor(private memberAppService: MemberAppService) {}

	@Post('init')
	async init(): Promise<boolean> {
		return !!(await this.memberAppService.initSetting())
	}

	@Patch('template/otp-mail')
	async updateOtpMailTemplate(
		@Body(new JoiValidatePine(EditTemplateScriptSchema))
		editTemplateScriptDto: EditTemplateScriptDto
	): Promise<boolean> {
		return !!(await this.memberAppService.updateOtpMailTemplate(
			editTemplateScriptDto.script
		))
	}
}
