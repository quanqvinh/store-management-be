import { Controller, Get, Param } from '@nestjs/common'
import { JwtAccessTokenGuard, MemberAuth, User } from '@/common/decorators'
import { MemberAppService } from '../setting/services/member-app.service'
import { MemberService } from './member.service'
import { TemplateService } from '../template/services/template.service'
import { MemberRankService } from '../member-rank/member-rank.service'
import { MemberRank } from '../member-rank/schemas/member-rank.schema'
import { ApiTags } from '@nestjs/swagger'
import { HomeDataDto } from './dto/response/home-data.dto'
import { SkipThrottle } from '@nestjs/throttler'
import { Auth } from '@/common/decorators/auth.decorator'
import { EmployeeRole } from '@/constants'

@Controller('member')
@ApiTags('member')
export class MemberController {
	constructor(
		private memberAppSettingService: MemberAppService,
		private memberService: MemberService,
		private templateService: TemplateService,
		private memberRankService: MemberRankService
	) {}

	@Get('list')
	@SkipThrottle()
	@Auth(EmployeeRole.SALESPERSON, EmployeeRole.ADMIN)
	async getListMember() {
		return await this.memberService.findAll()
	}

	@Get('home')
	@SkipThrottle()
	@JwtAccessTokenGuard()
	async getHomeData(@User() member: MemberAuth): Promise<HomeDataDto> {
		const appSetting = await this.memberAppSettingService.get('greeting')
		const homeData = await this.memberService.getMemberDataInHome(member.id)

		const greeting = await this.templateService.generateHtml({
			template: appSetting.greeting.content,
			data: { firstName: homeData.memberData.firstName },
		})

		const memberInfo = homeData.memberData.memberInfo
		const memberRank = memberInfo.rank as unknown as MemberRank

		return {
			head: {
				greeting: {
					icon: appSetting.greeting.image,
					content: greeting,
				},
				couponCount: homeData.couponCount,
				notificationCount: homeData.notificationCount,
			},
			memberInfo: {
				fullName: homeData.memberData['fullName'],
				code: memberInfo.code,
				point: memberInfo.currentPoint,
				memberRank: {
					name: memberRank?.name,
					...memberRank?.display,
				},
			},
		}
	}

	@Get('rank')
	@SkipThrottle()
	@JwtAccessTokenGuard()
	async getMemberRankInfo(@User() member: MemberAuth) {
		return await this.memberService.getMemberInfo(member.id)
	}

	@Get(':code/short')
	@SkipThrottle()
	@Auth(EmployeeRole.SALESPERSON)
	async getMemberShortInfo(@Param('code') memberCode: string) {
		return await this.memberService.getShortInfo({ code: memberCode })
	}
}
