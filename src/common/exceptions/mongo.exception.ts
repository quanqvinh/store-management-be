import { MongoError, MongoServerError } from 'mongodb'

export class MongoException extends MongoError {
	private _name: string
	httpCode = 400
	public get name(): string {
		return this._name
	}
	public set name(value: string) {
		this._name = value
	}
}

export class DuplicateKeyException extends MongoException {
	constructor(exception: MongoServerError) {
		const key = Object.keys(exception.keyValue)[0]
		super(`Value '${exception.keyValue[key]}' of field '${key}' is duplicated`)
		this.name = 'DuplicateKeyException'
		this.httpCode = 422
	}

	static check(err) {
		return err.name === 'MongoServerError' && err.code === 11000
	}
}

export class FailedTransactionException extends MongoException {
	constructor() {
		super('Write data failed')
		this.name = 'FailedTransactionException'
		this.httpCode = 503
	}
}
