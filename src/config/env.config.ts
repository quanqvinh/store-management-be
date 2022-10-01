import * as Joi from 'joi'
import { config } from 'dotenv'

export const envConfigValidate = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production'),
	PORT: Joi.number().min(127).max(65535),
	MONGO_URL: Joi.string().required(),
	ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
	ACCESS_TOKEN_EXPIRE: Joi.string().required(),
	REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
	REFRESH_TOKEN_EXPIRE: Joi.string().required(),
})

export const envConfigLoad = (options = { load: false }) => {
	if (options.load) config()
	return {
		nodeEnv: process.env.NODE_ENV || 'development',
		port: process.env.PORT || 8080,
		mongo: {
			url: process.env.MONGO_URL,
		},
		jwt: {
			accessToken: {
				secret: process.env.ACCESS_TOKEN_SECRET_KEY,
				expire: process.env.ACCESS_TOKEN_EXPIRE,
			},
			refreshToken: {
				secret: process.env.REFRESH_TOKEN_SECRET_KEY,
				expire: process.env.REFRESH_TOKEN_EXPIRE,
			},
		},
	}
}
