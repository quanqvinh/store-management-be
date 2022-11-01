import { Module } from '@nestjs/common'
import { EmployeeService } from './employee.service'
import { EmployeeController } from './employee.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Employee, EmployeeSchema } from './schemas/employee.schema'
import { DatabaseConnectionName } from '@/constants'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Employee.name, schema: EmployeeSchema }],
			DatabaseConnectionName.DATA
		),
	],
	controllers: [EmployeeController],
	providers: [EmployeeService],
	exports: [EmployeeService],
})
export class EmployeeModule {}
