import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/modules/app/app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)
	const port = configService.get<number>('port') || 8080
	await app.listen(port, () => {
		if (configService.get<string>('nodeEnv') === 'development')
			console.log(`Server runs at http://localhost:${port}`)
	})
}
bootstrap()
