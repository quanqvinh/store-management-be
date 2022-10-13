import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/modules/app/app.module'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { randomString } from '@/utils'
import { static as staticDir } from 'express'
import { join } from 'path'

async function bootstrap() {
	await ConfigModule.envVariablesLoaded
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)
	const nodeEnv = configService.get<string>('nodeEnv')
	app.use(staticDir(join(__dirname, '..', 'public')))

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
		.setTitle('Store Management OpenAPI')
		.setDescription('SM System OpenAPI')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	const port = configService.get<number>('port') || 8080
	await app.listen(port, () => {
		if (nodeEnv === 'development') {
			console.log(`Server runs at http://localhost:${port}`)
			console.log(`OpenAPI viewed at http://localhost:${port}/api`)
		}
	})
}
bootstrap()
