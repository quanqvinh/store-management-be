/**
 * Convert string of date to Date
 * @param {string} s date text in the right format
 * @param {string} format format of day, month and year
 */
export const stringToDate = (s: string, format = 'DD-MM-YYYY') => {
	const iYear = format.search('YYYY') ?? format.search('yyyy')
	const iMonth = format.search('MM') ?? format.search('mm')
	const iDay = format.search('DD') ?? format.search('dd')
	if ([iYear, iMonth, iDay].includes(-1)) throw new Error()

	return new Date(
		+s.slice(iYear, iYear + 4),
		+s.slice(iMonth, iMonth + 2) - 1,
		+s.slice(iDay, iDay + 2) + 1
	)
}
