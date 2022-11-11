class Greeting {
	icon: string
	content: string
}

class Head {
	greeting: Greeting
	couponCount: number
	notificationCount: number
}

class MemberRank {
	name: string
	icon: string
	color: string
	background: string
}

class MemberInfo {
	fullName: string
	code: string
	point: number
	memberRank: MemberRank
}

export class HomeDataDto {
	head: Head
	memberInfo: MemberInfo
}
