import { Types } from 'mongoose'

export const checkObjectId = (id: string): boolean => {
	try {
		return new Types.ObjectId(id).toString() === id
	} catch {
		return false
	}
}
