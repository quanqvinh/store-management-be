import { UserRole } from '@/constants/index'
import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../user/schemas/user.schema'
import { AdminSchema } from './schemas/admin.schema'
import { HashService } from '@/common/providers/hash.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
				discriminators: [{ name: UserRole.ADMIN, schema: AdminSchema }],
			},
		]),
	],
	controllers: [AdminController],
	providers: [AdminService, HashService],
	exports: [AdminService],
})
export class AdminModule {}
