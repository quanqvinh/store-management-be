/**
 * Sleep in millisecond
 * @param time number
 * @returns Promise<any>
 */
export const sleep = async (time: number): Promise<any> => {
	return await new Promise(resolve => setTimeout(resolve, time))
}
