import { Module } from '@nestjs/common'
import { EmployeeService } from './employee.service'
import { EmployeeController } from './employee.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { DatabaseConnectionName, EmployeeRole } from '@/constants'
import { HashService } from '@/common/providers/hash.service'
import {
	AdminSchema,
	Employee,
	EmployeeSchema,
	SalespersonSchema,
} from './schemas'

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: Employee.name,
					schema: EmployeeSchema,
					discriminators: [
						{ name: EmployeeRole.SALESPERSON, schema: SalespersonSchema },
						{ name: EmployeeRole.ADMIN, schema: AdminSchema },
					],
				},
			],
			DatabaseConnectionName.DATA
		),
	],
	controllers: [EmployeeController],
	providers: [EmployeeService, HashService],
	exports: [EmployeeService],
})
export class EmployeeModule {}
