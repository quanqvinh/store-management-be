import { Cookie, SignedCookie } from '@/common/decorators'
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(@Cookie() cookies, @SignedCookie() signedCookies): string {
		console.log('Check cookies:', cookies)
		console.log('Check signed cookies', signedCookies)
		return this.appService.getHello()
	}
}
