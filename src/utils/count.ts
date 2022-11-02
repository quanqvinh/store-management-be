export const count = (start = 0, step = 1) => {
	let i = start
	return {
		value: () => i,
		inc: (amount = undefined): void => {
			i += amount ?? step
		},
	}
}
