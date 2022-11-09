import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { GridFsConfigService } from './grid-fs-config.service'
import { GridFSFile } from 'mongodb'
import { Response } from 'express'
import { NotFoundImageException } from '@/common/exceptions/http'

class ObjectId extends Types.ObjectId {}

@Injectable()
export class FileService {
	constructor(private gridFsConfigService: GridFsConfigService) {}

	async getOne(fileId: string | ObjectId): Promise<GridFSFile> {
		const files = await this.gridFsConfigService.bucket
			.find({ _id: new ObjectId(fileId) })
			.toArray()
		if (files.length === 0 || !files[0]) return null
		return files[0]
	}

	async getMany(fileIds: Array<string | ObjectId> = []): Promise<GridFSFile[]> {
		if (fileIds.length === 0)
			return await this.gridFsConfigService.bucket.find().toArray()
		const files = await this.gridFsConfigService.bucket
			.find({
				_id: { $in: fileIds.map(id => new ObjectId(id)) },
			})
			.toArray()
		return files
	}

	async render(fileId: string | ObjectId, response: Response) {
		const file = await this.getOne(fileId)
		if (!file) throw new NotFoundImageException()
		response.set({
			'Content-Type': file.contentType,
			'Cache-Control': 'public, max-age=1800',
		})
		return this.gridFsConfigService.bucket
			.openDownloadStream(new Types.ObjectId(fileId))
			.pipe(response)
	}

	async deleteOne(fileId: string | ObjectId): Promise<true> {
		await this.gridFsConfigService.bucket.delete(new ObjectId(fileId))
		return true
	}

	async deleteMany(fileIds: Array<string | ObjectId>): Promise<true> {
		await Promise.all(
			fileIds.map(fileId =>
				this.gridFsConfigService.bucket.delete(new ObjectId(fileId))
			)
		)
		return true
	}
}
