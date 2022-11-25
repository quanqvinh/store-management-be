import { JoiValidatePine } from '@/common/pipes'
import { Controller } from '@nestjs/common'
import { Post, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	CreateEmployeeDto,
	CreateEmployeeDtoSchema,
} from './dto/create-employee.dto'
import { EmployeeService } from './employee.service'

@Controller('employee')
@ApiTags('employee')
export class EmployeeController {
	constructor(private readonly employeeService: EmployeeService) {}

	@Post('create')
	async createEmployee(
		@Body(new JoiValidatePine(CreateEmployeeDtoSchema))
		createEmployeeDto: CreateEmployeeDto
	) {
		return await this.employeeService.create(createEmployeeDto)
	}
}
