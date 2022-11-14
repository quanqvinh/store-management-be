export const usernamePattern = {
	hasLetter: new RegExp(/^(?=.*[a-zA-Z]+).*$/),
	normal: new RegExp(/^[0-9a-zA-Z_]{4,}$/),
}
