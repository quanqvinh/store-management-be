import * as Joi from 'joi'

export default Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production')
		.default('development'),
	PORT: Joi.number().min(127).max(65535).default(8080),
	MONGODB_URL: Joi.string().required(),
})
