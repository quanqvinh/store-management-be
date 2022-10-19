import { Module } from '@nestjs/common'
import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Member, MemberSchema } from './schemas/member.schema'
import { HashService } from '@/common/providers/hash.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
	],
	controllers: [MemberController],
	providers: [MemberService, HashService],
	exports: [MemberService],
})
export class MemberModule {}
