import { Injectable } from '@nestjs/common'
import { ClientSession, Connection } from 'mongoose'
import { count, sleep } from '@/utils'
import { InjectConnection } from '@nestjs/mongoose'
import { DatabaseConnectionName } from '@/constants'

type TransactionParams = {
	writeCb: (session: ClientSession) => Promise<boolean>
	retryTransactionTime?: number
}

const DEFAULT_RETRY_TIME = 100

@Injectable()
export class TransactionService {
	constructor(
		@InjectConnection(DatabaseConnectionName.DATA)
		private readonly connection: Connection
	) {}

	private async commitWithRetry(session: ClientSession) {
		try {
			await session.commitTransaction()
			console.log('Transaction committed')
		} catch (error) {
			if (error.hasErrorLabel('UnknownTransactionCommitResult')) {
				console.log(
					'UnknownTransactionCommitResult, retrying commit operation ...'
				)
				await this.commitWithRetry(session)
			} else if (error.hasErrorLabel('TransientTransactionError')) {
				console.log('TransientTransactionError, retrying commit operation ...')
				await this.commitWithRetry(session)
			} else {
				console.log('Error during commit ...')
				throw error
			}
		}
	}

	async execute({
		writeCb,
		retryTransactionTime = DEFAULT_RETRY_TIME,
	}: TransactionParams): Promise<{ result: boolean; error: any }> {
		console.log('Transaction start...')
		const session = await this.connection.startSession()
		session.startTransaction()
		let result: boolean, error: any

		try {
			const counter = count()

			while (counter.value() < retryTransactionTime) {
				try {
					result = await writeCb(session)
					await this.commitWithRetry(session)
					break
				} catch (error) {
					await session.abortTransaction()
					console.log('Transaction aborted')
					if (
						error.hasErrorLabel &&
						(error.hasErrorLabel('UnknownTransactionCommitResult') ||
							error.hasErrorLabel('TransientTransactionError'))
					) {
						console.log(error.name + ': ' + error.message)
						console.log('Retrying transaction ...')

						await sleep(50)
						counter.inc()
						continue
					}
					throw error
				}
			}

			if (counter.value() > retryTransactionTime)
				throw new Error('Transaction failed')
		} catch (err) {
			console.log(err)
			error = err
		} finally {
			await session.endSession()
			console.log('Transaction end...')
		}
		return { error, result }
	}
}
