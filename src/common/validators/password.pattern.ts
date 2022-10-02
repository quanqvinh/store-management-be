export const amountCharacter = (min = 8, max = 100) =>
	new RegExp(`^.{${min},${max}}$`)
export const hasNumber = new RegExp(/^(?=.*\d+).*$/)
export const hasLetter = new RegExp(/^(?=.*[a-zA-Z]+).*$/)
export const hasUpperLetter = new RegExp(/^(?=.*[A-Z]+).*$/)
export const hasLowerLetter = new RegExp(/^(?=.*[A-Z]+).*$/)
export const hasSpecialCharacter = new RegExp(
	/^(?=.*[-+=_)(\*&\^%\$#@!~”’:;|\}]{[/?.>,<]+).*$/
)