import { DatabaseConnectionName } from '@/constants'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, Model } from 'mongoose'
import { OtpToken, OtpTokenDocument } from '../schemas/otp-token.schema'
import { authenticator } from 'otplib'

@Injectable()
export class OtpService {
	constructor(
		@InjectModel(OtpToken.name, DatabaseConnectionName.DATA)
		private readonly otpModel: Model<OtpTokenDocument>
	) {
		authenticator.options = {
			epoch: Date.now(),
			step: 60 * 3,
			window: 0,
		}
	}

	async generate(email: string) {
		try {
			const secret = authenticator.generateSecret()
			const otp = authenticator.generate(secret)
			return await this.otpModel.create({ email, value: otp, secret })
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	async verify(email: string, otp: string) {
		try {
			const otpDocument = await this.otpModel
				.findOneAndDelete({ email, value: otp })
				.orFail(new UnauthorizedException('OTP token is invalid'))
				.lean()
				.exec()

			return authenticator.check(otp, otpDocument.secret)
		} catch (err) {
			console.log(err)
			throw err
		}
	}
}
