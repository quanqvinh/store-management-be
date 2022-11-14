import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from '@/modules/app/app.module'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { randomString } from '@/utils'
import compression from 'compression'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api/v1')
	app.use(compression())
	const configService = app.get(ConfigService)
	const nodeEnv = configService.get<string>('nodeEnv')

	// Logger middleware
	app.use(morgan('tiny'))

	// Security middlewares
	// CORS
	app.enableCors()
	// Helmet
	app.use(helmet())
	// CSRF
	app.use(cookieParser(randomString()))

	// Swagger
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Store Management OpenAPI')
		.setDescription(
			`
	=== NOTE ===
	- If response data type is boolean, the actual response is { success: boolean }
	- Otherwise, the response type is T, the actual response is { data: T }
	=== TOKEN 30 DAYS ===
	19110499@student.hcmute.edu.vn
	- Access token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MzZlOGRiNWMzMTJiOGFkOTgwNGFlZWQiLCJpYXQiOjE2NjgyNjI5MTYsImV4cCI6MTY3MDg1NDkxNiwic3ViIjoiYWNjZXNzIn0.sGaBtE-TPmI5xvdApdWuU38LGplvqlf_tdNAXFYpuQ8
	- Refresh token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MzZlOGRiNWMzMTJiOGFkOTgwNGFlZWQiLCJpYXQiOjE2NjgyNjI5MTYsImV4cCI6MTY3MDg1NDkxNiwic3ViIjoicmVmcmVzaCJ9.UvETWNk6V8od78FBcpFfke5QOMWlQxzEeBuLwfGUWi4
		`
		)
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	const port = configService.get<number>('port') || 8080
	await app.listen(port, () => {
		if (nodeEnv === 'development') {
			Logger.debug(`Server runs at http://localhost:${port}`, 'Server')
			Logger.debug(`OpenAPI viewed at http://localhost:${port}/api`, 'Swagger')
		}
	})
}
bootstrap()
