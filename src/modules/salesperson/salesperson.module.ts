import { Module } from '@nestjs/common'
import { SalespersonService } from './salesperson.service'
import { SalespersonController } from './salesperson.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../user/schemas/user.schema'
import { Salesperson, SalespersonSchema } from './schemas/salesperson.schema'
import { HashService } from '@/common/providers/hash.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
				discriminators: [{ name: Salesperson.name, schema: SalespersonSchema }],
			},
		]),
	],
	controllers: [SalespersonController],
	providers: [SalespersonService, HashService],
	exports: [SalespersonService],
})
export class SalespersonModule {}
