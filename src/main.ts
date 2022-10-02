import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/modules/app/app.module'
import { ConfigService, ConfigModule } from '@nestjs/config'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import { randomString } from '@/utils'

async function bootstrap() {
	await ConfigModule.envVariablesLoaded
	const app = await NestFactory.create(AppModule)
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
	app.use(
		csurf({
			cookie: {
				signed: true,
				secure: nodeEnv === 'production',
			},
		})
	)

	const port = configService.get<number>('port') || 8080
	await app.listen(port, () => {
		if (nodeEnv === 'development')
			console.log(`Server runs at http://localhost:${port}`)
	})
}
bootstrap()
