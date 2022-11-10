import { Module } from '@nestjs/common'
import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Member, MemberSchema } from './schemas/member.schema'
import { DatabaseConnectionName } from '@/constants'
import { TokenModule } from '../token/token.module'
import { MemberRankModule } from '../member-rank/member-rank.module'
import { SettingModule } from '../setting/setting.module'
import { TemplateModule } from '../template/template.module'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Member.name, schema: MemberSchema }],
			DatabaseConnectionName.DATA
		),
		TokenModule,
		MemberRankModule,
		SettingModule,
		TemplateModule,
	],
	controllers: [MemberController],
	providers: [MemberService],
	exports: [MemberService, MongooseModule],
})
export class MemberModule {}
