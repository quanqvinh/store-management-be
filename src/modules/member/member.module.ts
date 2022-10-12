import { Module } from '@nestjs/common'
import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../user/schemas/user.schema'
import { Member, MemberSchema } from './schemas/member.schema'
import { HashService } from '@/common/providers/hash.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
				discriminators: [{ name: Member.name, schema: MemberSchema }],
			},
		]),
	],
	controllers: [MemberController],
	providers: [MemberService, HashService],
	exports: [MemberService],
})
export class MemberModule {}
