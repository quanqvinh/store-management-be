import { CreateStoreDto } from '../dto/create-store.dto'

const data: CreateStoreDto = {
	name: '',
	dailyTime: {
		open: {
			hour: 0,
			minute: 0,
		},
		close: {
			hour: 23,
			minute: 59,
		},
	},
	address: {
		street: '',
		ward: '',
		district: '',
		city: '',
		country: '',
	},
}

let output = '\n'
for (const field in data) {
	let value = data[field]
	if (typeof value === 'object') value = JSON.stringify(value)
	output += field + ':' + value + '\n'
}
console.log(output)
