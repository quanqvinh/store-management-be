import { Cookie, SignedCookie } from '@/common/decorators'
import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import { ApiTagsAndBearer } from '@/common/decorators/api-tag-and-bearer.decorator'

@ApiTagsAndBearer('app')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@UseInterceptors(LoggingInterceptor)
	@Get()
	getHello(@Cookie() cookies, @SignedCookie() signedCookies): string {
		console.log('Check cookies:', cookies)
		console.log('Check signed cookies:', signedCookies)
		return this.appService.getHello()
	}
}
