import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	getHello() {
		return 'Welcome to Store Management API System'
	}
}
