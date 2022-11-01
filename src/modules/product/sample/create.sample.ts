import { CreateProductDto } from '../dto/request/create-product.dto'
const data: CreateProductDto = {
	name: 'Iced milk coffee',
	category: {
		isNew: false,
		name: 'Coffee',
	},
	originalPrice: 29000,
	description:
		'Pure Dak Lak coffee is traditionally brewed with condensed milk to create a rich flavor, harmonizing the sweetness of the tip of the tongue and the elegant bitterness in the aftertaste.',
	size: [
		{
			name: 'Small',
			key: 'S',
			fee: 0,
		},
		{
			name: 'Medium',
			key: 'M',
			fee: 6000,
		},
		{
			name: 'Large',
			key: 'L',
			fee: 10000,
		},
	],
	topping: [
		{
			name: 'Macchiato Cream Cheese',
			fee: 10000,
		},
		{
			name: 'Shot Espresso',
			fee: 10000,
		},
		{
			name: 'White Pearl',
			fee: 10000,
		},
		{
			name: 'Caramel Sauce',
			fee: 10000,
		},
		{
			name: 'Coffee Jelly',
			fee: 10000,
		},
	],
}
const output = Object.keys(data).reduce((result, field) => {
	const temp =
		typeof data[field] === 'object' ? JSON.stringify(data[field]) : data[field]
	result += `${field}:${temp}\n`
	return result
}, '\n')
console.log(output)
