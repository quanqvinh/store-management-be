import * as Joi from 'joi'
import { NodeEnv } from '@/constants'
import { config } from 'dotenv'

config()

export const envConfigValidate = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production'),
	PORT: Joi.number().min(127).max(65535),
	MONGO_URL: Joi.string().uri().required(),
	MONGO_STORAGE_URL: Joi.string().uri().required(),
	ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
	ACCESS_TOKEN_EXPIRE: Joi.string().required(),
	REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
	REFRESH_TOKEN_EXPIRE: Joi.string().required(),
	GOOGLE_MAILER_CLIENT_ID: Joi.string().required(),
	GOOGLE_MAILER_CLIENT_SECRET: Joi.string().required(),
	GOOGLE_MAILER_REFRESH_TOKEN: Joi.string().required(),
	ADMIN_EMAIL_ADDRESS: Joi.string().email().required(),
})

export const envConfigLoad = () => ({
	nodeEnv: process.env.NODE_ENV ?? NodeEnv.DEVELOPMENT,
	port: process.env.PORT || 8080,
	mongo: {
		dataUrl: process.env.MONGO_URL,
		storageUrl: process.env.MONGO_STORAGE_URL,
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
	otp: {
		expire: process.env.OTP_TOKEN_EXPIRE,
	},
	googleMailer: {
		clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
		clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
		refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
		adminEmail: process.env.ADMIN_EMAIL_ADDRESS,
	},
})
