export enum DatabaseConnectionName {
	STORAGE = 'storage',
	DATA = 'data',
}

export enum NodeEnv {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
}

export enum IdentifierType {
	EMAIL = 'email',
	USERNAME = 'username',
	MOBILE = 'mobile',
}

export enum TokenSubject {
	ACCESS = 'access',
	REFRESH = 'refresh',
}

export enum Gender {
	MALE = 'male',
	FEMALE = 'female',
	OTHER = 'other',
}

export enum EmployeeRole {
	ADMIN = 'admin',
	SALESPERSON = 'salesperson',
}

export enum ApplyCouponType {
	ONCE = 'once',
	PERIODIC = 'periodic',
}

export enum CycleType {
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year',
}

export enum CouponSource {
	GIFT = 'gift',
	PROMOTION = 'promotion',
	ACHIEVEMENT = 'achievement',
	AUTO_SYSTEM = 'auto_system',
}

export enum OrderType {
	ON_PREMISE = 'on_premise',
	PICK_UP = 'pick_up',
	DELIVERY = 'delivery',
}

export enum PaymentType {
	CASH = 'cash',
}

export enum StoreSatisfaction {
	SERVICE = 'service',
	PRODUCT = 'product',
	APPLICATION = 'application',
	SPACE = 'space',
}

export enum NotificationType {
	ORDER = 'order',
	COUPON = 'coupon',
	ACHIEVEMENT = 'achievement',
	RANK_UP = 'rank_up',
	GIFT = 'gift',
	PROMOTION = 'promotion',
}

export enum SettingType {
	GENERAL = 'general',
	ADMIN_APP = 'admin_app',
	SALE_APP = 'sale_app',
	MEMBER_APP = 'member_app',
}

export enum TemplateType {
	MAIL = 'mail',
	NOTIFICATION = 'notification',
}

export enum ContactType {
	PHONE_NUMBER = 'phone_number',
	EMAIL = 'email',
	WEBSITE = 'website',
	OTHER = 'other',
}
