import { DatabaseConnectionName } from '@/constants'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SettingModule } from '../setting/setting.module'
import { MemberTypeController } from './member-type.controller'
import { MemberTypeService } from './member-type.service'
import { MemberType, MemberTypeSchema } from './schemas/member-type.schema'

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: MemberType.name, schema: MemberTypeSchema }],
			DatabaseConnectionName.DATA
		),
		SettingModule,
	],
	controllers: [MemberTypeController],
	providers: [MemberTypeService],
	exports: [MemberTypeService],
})
export class MemberTypeModule {}
