import { EmployeeRole } from '@/constants'

export type File = Express.Multer.File

export type JwtPayload = {
	sub: string
	aud: string
	exp: number
	iat: number
	role?: EmployeeRole
}

export type ChangeFields<T, R> = Omit<T, keyof R> & R
