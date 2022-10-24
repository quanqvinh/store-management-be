import { Injectable } from '@nestjs/common'
import { Employee, EmployeeDocument } from './schemas/employee.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class EmployeeService {
	constructor(
		@InjectModel(Employee.name) public employeeModel: Model<EmployeeDocument>
	) {}
}
