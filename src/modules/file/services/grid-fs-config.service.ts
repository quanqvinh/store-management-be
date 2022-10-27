import { Injectable, Logger } from '@nestjs/common'
import {
	MulterModuleOptions,
	MulterOptionsFactory,
} from '@nestjs/platform-express'
import { GridFsStorage } from 'multer-gridfs-storage'
import { randomBytes } from 'crypto'
import path from 'path'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection, mongo } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { STORAGE_CONNECTION_NAME } from '@/constants'

const CHUNK_SIZE = 512 * 1024
const FILE_SIZE_MAX = 2 * 1024 * 1024

@Injectable()
export class GridFsConfigService implements MulterOptionsFactory {
	private storage: InstanceType<typeof GridFsStorage>
	bucket: InstanceType<typeof mongo.GridFSBucket>
	constructor(
		@InjectConnection(STORAGE_CONNECTION_NAME)
		private readonly connection: Connection,
		private configService: ConfigService
	) {
		this.storage = new GridFsStorage({
			url: this.configService.get<string>('mongo.storageUrl'),
			cache: true,
			file: (req, file) => {
				if (!file.mimetype?.startsWith('image')) return null

				return new Promise((resolve, rejects) => {
					randomBytes(16, (err, buf) => {
						if (err) return rejects(err)
						const filename =
							buf.toString('hex') + path.extname(file.originalname)
						const fileInfo = {
							filename,
							bucketName: 'photos',
							chunkSize: CHUNK_SIZE,
						}
						resolve(fileInfo)
					})
				})
			},
		})

		this.bucket = new mongo.GridFSBucket(this.connection.db, {
			bucketName: 'photos',
		})

		this.storage.on('connection', () => {
			Logger.debug('File storage server is opened!', 'MULTER')
		})

		this.storage.on('connectionFailed', err => {
			Logger.error(`Connection failed\n` + err, 'MULTER')
		})

		this.storage.on('file', (file: Express.Multer.File) => {
			Logger.log(`${file.filename} is saved!`, 'MULTER')
		})
	}

	createMulterOptions(): MulterModuleOptions {
		return {
			storage: this.storage,
			limits: { fileSize: FILE_SIZE_MAX },
		}
	}
}
