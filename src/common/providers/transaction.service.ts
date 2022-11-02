import { Injectable } from '@nestjs/common'
import { ClientSession, startSession } from 'mongoose'
import { count, sleep } from '@/utils'

type TransactionParams = {
	writeCb: (session: ClientSession) => Promise<void>
	successCb: () => void
	failedCb: (error: any) => void
	retryTransactionTime?: number
}

const DEFAULT_RETRY_TIME = 100

@Injectable()
export class TransactionService {
	private async commitWithRetry(session: ClientSession) {
		try {
			await session.commitTransaction()
			console.log('Transaction committed.')
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
		successCb,
		failedCb,
		retryTransactionTime,
	}: TransactionParams) {
		try {
			const session = await startSession()
			const retryTime = retryTransactionTime ?? DEFAULT_RETRY_TIME

			const counter = count()

			while (counter.value() < retryTime) {
				try {
					await writeCb(session)
					await this.commitWithRetry(session)
					break
				} catch (error) {
					await session.abortTransaction()

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

			if (counter.value() > retryTime) throw new Error('Transaction failed')

			successCb()
		} catch (err) {
			failedCb(err)
		}
	}
}
