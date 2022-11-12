import { DailyTime } from '@/modules/store/schemas/store.schema'

export const setDailyTime = (
	openHour: number,
	openMinute: number,
	closeHour: number,
	closeMinute: number
): DailyTime => ({
	open: {
		hour: openHour,
		minute: openMinute,
	},
	close: {
		hour: closeHour,
		minute: closeMinute,
	},
})
