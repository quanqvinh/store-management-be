import { NotCreatedDataException } from '@/common/exceptions/http'
import { Injectable } from '@nestjs/common'
import { Employee, EmployeeDocument } from './schemas/employee.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { DatabaseConnectionName } from '@/constants'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { HashService } from '@/common/providers/hash.service'
import { DuplicateKeyException } from '@/common/exceptions/mongo.exception'

@Injectable()
export class EmployeeService {
	constructor(
		@InjectModel(Employee.name, DatabaseConnectionName.DATA)
		public employeeModel: Model<EmployeeDocument>,
		private hashService: HashService
	) {}

	async create(dto: CreateEmployeeDto) {
		const defaultPassword = '123456789'
		try {
			return await this.employeeModel.create({
				...dto,
				auth: {
					password: this.hashService.hash(defaultPassword),
				},
			})
		} catch (err) {
			if (DuplicateKeyException.check(err)) {
				throw new DuplicateKeyException(err)
			}
			throw new NotCreatedDataException()
		}
	}
}
