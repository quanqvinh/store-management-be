import { MailerModule, MailerOptions } from '@nestjs-modules/mailer'
import { Logger, Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailController } from './mail.controller'
import { OAuth2Client } from 'google-auth-library'
import { ConfigModule, ConfigService } from '@nestjs/config'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { createTransport } from 'nodemailer'
import { TemplateModule } from '../template/template.module'

function verifySMTPConnection(options: SMTPTransport.Options) {
	const transporter = createTransport(options)
	transporter.verify((err, _success) => {
		if (err) Logger.error('SMTP connection failed\n' + err, 'Nodemailer')
		else Logger.debug('SMTP connect successfully', 'Nodemailer')
	})
}

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService): Promise<MailerOptions> => {
				const clientId = config.get<string>('googleMailer.clientId')
				const clientSecret = config.get<string>('googleMailer.clientSecret')
				const refreshToken = config.get<string>('googleMailer.refreshToken')
				const adminEmail = config.get<string>('googleMailer.adminEmail')

				const myOAuth2Client = new OAuth2Client({ clientId, clientSecret })

				myOAuth2Client.setCredentials({ refresh_token: refreshToken })

				const options: SMTPTransport.Options = {
					service: 'gmail',
					auth: {
						type: 'OAuth2',
						user: adminEmail,
						clientId,
						clientSecret,
						refreshToken,
					},
					tls: {
						rejectUnauthorized: false,
					},
				}
				await verifySMTPConnection(options)

				return {
					transport: options,
					defaults: {
						from: '"VT Corp" <noreply@example.com>',
					},
				}
			},
		}),
		TemplateModule,
	],
	controllers: [MailController],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
