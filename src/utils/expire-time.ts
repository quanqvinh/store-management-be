export const expireTimeFormats = (expireTime: string) => {
	const number = parseInt(expireTime)
	const timeUnit = {
		ms: 'millisecond',
		s: 'second',
		m: 'minute',
		h: 'hour',
		d: 'day',
	}
	const unit =
		Object.keys(timeUnit).find(unit => expireTime.endsWith(unit)) ?? 'm'
	return {
		number,
		text: `${number} ${timeUnit[unit]}${number > 1 ? 's' : ''}`,
	}
}
