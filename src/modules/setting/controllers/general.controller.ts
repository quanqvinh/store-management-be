import { Post } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { GeneralService } from '../services/general.service'

@Controller('setting/general')
export class GeneralController {
	constructor(private generalService: GeneralService) {}

	@Post('init')
	async init(): Promise<boolean> {
		return !!(await this.generalService.initSetting())
	}
}
