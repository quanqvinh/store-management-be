export const passwordPattern = {
	amountCharacter: (min = 8, max = 100) => new RegExp(`^.{${min},${max}}$`),
	hasNumber: new RegExp(/^(?=.*\d+).*$/),
	hasLetter: new RegExp(/^(?=.*[a-zA-Z]+).*$/),
	hasUpperLetter: new RegExp(/^(?=.*[A-Z]+).*$/),
	hasLowerLetter: new RegExp(/^(?=.*[A-Z]+).*$/),
	hasSpecialCharacter: new RegExp(
		/^(?=.*[-+=_)(\*&\^%\$#@!~”’:;|\}]{[/?.>,<]+).*$/
	),
}
