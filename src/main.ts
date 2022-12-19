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
	
	=== TESTING ACCESS TOKEN ===
	
	- 19110499@student.hcmute.edu.vn (member) - Access token: 
	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MzcyMGI5MWIwMTY2NjIyYzE3NjlmZDAiLCJpYXQiOjE2NzE0NjE1NDUsImV4cCI6MTcwMzg2OTIwMCwic3ViIjoiYWNjZXNzIn0.T695EtN1GoOpEhbBp06Nxo4be8yHKdNtzs0g1fnu_30

	- phantrungtin01@gmail.com (member) - Access token:
	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MzhkOWMzMmQ3MDk1YTE0NmMzZGFlNmIiLCJpYXQiOjE2NzE0NjE3MTgsImV4cCI6MTcwMzg2OTIwMCwic3ViIjoiYWNjZXNzIn0.Mbna-V4cPefhGKgNyZ7iQUY_LHfm1MguDLWDRLZllOo

	- salesman01 (employee) - Access token:
	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MzdmODhkZDZkOGI2Yjg3ZDFhZmYwYzAiLCJyb2xlIjoic2FsZXNwZXJzb24iLCJzdG9yZSI6IjYzNjI5OThiZmI5MDJlZmQ4MTRlYTFkNyIsImlhdCI6MTY3MTQ2MTg5MSwiZXhwIjoxNzAzODY5MjAwLCJzdWIiOiJhY2Nlc3MifQ.uKejD-odriC8uHVpd9CHWPI6xu2NvZG11BMNMYuIgbk

	- admin01 (admin) - Access token:
	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2M2EwN2JiZjQ3ODU0ZGQ2M2U0MGFiOGQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzE0NjE5NjksImV4cCI6MTcwMzg2OTIwMCwic3ViIjoiYWNjZXNzIn0.tH0-Nn2Mu-anu7bLKuA6AOmuVrkhN8mdgZS4R1euszw
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
