import { Injectable } from '@nestjs/common'
import { Employee, EmployeeDocument } from './schemas/employee.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DatabaseConnectionName } from '@/constants'

@Injectable()
export class EmployeeService {
	constructor(
		@InjectModel(Employee.name, DatabaseConnectionName.DATA)
		public employeeModel: Model<EmployeeDocument>
	) {}
}
