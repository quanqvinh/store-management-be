import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'
import {
	RefreshToken,
	RefreshTokenDocument,
} from '../schemas/refresh-token.schema'
import { JwtPayload } from '@/types'
import { UpdateResult, DeleteResult } from 'mongodb'

@Injectable()
export class RefreshService {
	constructor(
		@InjectModel(RefreshToken.name)
		public refreshTokenModel: Model<RefreshTokenDocument>,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	// Private methods
	private resignToken(payload): string {
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>('jwt.refreshToken.secret'),
		})
	}

	private async delete(tokenValue): Promise<DeleteResult> {
		return await this.refreshTokenModel.deleteOne({ value: tokenValue }).exec()
	}

	private async disable(tokenValue): Promise<UpdateResult> {
		return await this.refreshTokenModel
			.updateOne({ value: tokenValue }, { disabled: true })
			.exec()
	}

	// Public methods
	async save(uid, value): Promise<boolean> {
		const token = await this.refreshTokenModel.create({
			uid,
			value,
		})
		if (token) return true
		return false
	}

	async get(payload: JwtPayload): Promise<RefreshToken> {
		return await this.refreshTokenModel
			.findOne({ value: this.resignToken(payload) })
			.lean()
			.exec()
	}

	async check(token: RefreshToken): Promise<boolean> {
		if (token.disabled) {
			await this.delete(token.value)
			return false
		}
		const disableStatus = await this.disable(token.value)
		if (disableStatus.modifiedCount !== 1)
			console.log('Disable refresh token failed')
		return true
	}
}
