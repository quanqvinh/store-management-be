import * as Joi from 'joi'

export const envConfigValidate = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production'),
	PORT: Joi.number().min(127).max(65535),
	MONGO_URL: Joi.string().required(),
})

export const envConfigLoad = () => ({
	nodeEnv: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8080,
	mongo: {
		username: process.env.MONGO_USERNAME,
		password: process.env.MONGO_PASSWORD,
		database: process.env.MONGO_DATABASE,
		url: process.env.MONGO_URL,
	},
})
