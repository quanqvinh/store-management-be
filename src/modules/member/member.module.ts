import { Module } from '@nestjs/common'
import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Member, MemberSchema } from './schemas/member.schema'
import { DatabaseConnectionName } from '@/constants'
import { TokenModule } from '../token/token.module'
import { MemberTypeModule } from '../member-type/member-type.module'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Member.name, schema: MemberSchema }],
			DatabaseConnectionName.DATA
		),
		TokenModule,
		MemberTypeModule,
	],
	controllers: [MemberController],
	providers: [MemberService],
	exports: [MemberService, MongooseModule],
})
export class MemberModule {}
