import { MongoError } from 'mongodb'

class MongoException extends MongoError {
	private _name: string
	public get name(): string {
		return this._name
	}
	public set name(value: string) {
		this._name = value
	}
}

export class DuplicateKeyException extends MongoException {
	constructor(keyName: string) {
		super(`This ${keyName} is existed`)
		this.name = 'DuplicateKeyException'
	}
}
