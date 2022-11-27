export const generateUniqueNumber = () => {
	return Math.floor((Date.now() / Math.random()) % 10e15)
}
