export const minCharacter = (min: number) => new RegExp(`^(?=.{${min},})$`)
export const maxCharacter = (max: number) => new RegExp(`^(?=.{,${max}})$`)
export const hasNumber = new RegExp(/^(?=.*\d+).*$/)
export const hasLetter = new RegExp(/^(?=.*[a-zA-Z]+).*$/)
export const hasUpperLetter = new RegExp(/^(?=.*[A-Z]+).*$/)
export const hasLowerLetter = new RegExp(/^(?=.*[A-Z]+).*$/)
export const hasSpecialCharacter = new RegExp(
	/^(?=.*[-+=_)(\*&\^%\$#@!~”’:;|\}]{[/?.>,<]+).*$/
)
