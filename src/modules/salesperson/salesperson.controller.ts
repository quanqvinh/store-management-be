import { Controller } from '@nestjs/common'
import { SalespersonService } from './salesperson.service'

@Controller('salesperson')
export class SalespersonController {
	constructor(private readonly salespersonService: SalespersonService) {}
}
