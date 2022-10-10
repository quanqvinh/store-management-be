import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
	User,
	UserSchema,
	Admin,
	AdminSchema,
	Member,
	MemberSchema,
	Salesperson,
	SalespersonSchema,
} from './schemas'
import { HashService } from '@/common/providers/hash.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
				discriminators: [
					{ name: Admin.name, schema: AdminSchema },
					{ name: Member.name, schema: MemberSchema },
					{ name: Salesperson.name, schema: SalespersonSchema },
				],
			},
		]),
	],
	controllers: [UserController],
	providers: [UserService, HashService],
	exports: [UserService],
})
export class UserModule {}
