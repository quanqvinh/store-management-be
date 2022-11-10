import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SettingModule } from '../setting/setting.module'
import { MemberRankController } from './member-rank.controller'
import { MemberRankService } from './member-rank.service'
import { MemberRank, MemberRankSchema } from './schemas/member-rank.schema'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: MemberRank.name, schema: MemberRankSchema }],
			DatabaseConnectionName.DATA
		),
		SettingModule,
	],
	controllers: [MemberRankController],
	providers: [MemberRankService],
	exports: [MemberRankService],
})
export class MemberRankModule {}
