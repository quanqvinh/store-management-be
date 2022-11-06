import { Module } from '@nestjs/common'
import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Member, MemberSchema } from './schemas/member.schema'
import { DatabaseConnectionName } from '@/constants'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Member.name, schema: MemberSchema }],
			DatabaseConnectionName.DATA
		),
	],
	controllers: [MemberController],
	providers: [MemberService],
	exports: [MemberService],
})
export class MemberModule {}
