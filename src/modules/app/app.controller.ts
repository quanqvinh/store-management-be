import { Cookie, SignedCookie } from '@/common/decorators'
import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('app')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@UseInterceptors(LoggingInterceptor)
	getHello(@Cookie() cookies, @SignedCookie() signedCookies): string {
		console.log('Check cookies:', cookies)
		console.log('Check signed cookies:', signedCookies)
		return this.appService.getHello()
	}
}
