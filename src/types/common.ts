import { EmployeeRole } from '@/constants'

export type File = Express.Multer.File

export type JwtPayload = {
	sub: string
	aud: string
	exp: number
	iat: number
	role?: EmployeeRole
	store?: string
}

export type ChangeFields<T, R> = Omit<T, keyof R> & R

export type TemplateData<T extends string = string> = Record<
	T,
	string | number | boolean
>

export type TemplateWithData<T extends string = string> = {
	data: TemplateData<T>
	template: string
}

export type TemplateScript<T extends string = string> = {
	variables: Array<string>
} & Record<T, string>
