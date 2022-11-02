import { Post } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { MemberAppService } from '../services/member-app.service'

@Controller('setting/member-app')
export class MemberAppController {
	constructor(private memberAppService: MemberAppService) {}

	@Post('init')
	async init(): Promise<boolean> {
		return !!(await this.memberAppService.initSetting())
	}
}
