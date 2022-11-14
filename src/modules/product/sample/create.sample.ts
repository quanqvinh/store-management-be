// import { CreateProductDto } from '../dto/request/create-product.dto'
// const data: CreateProductDto = {
// 	name: 'Iced milk cofcost',
// 	category: {
// 		isNew: false,
// 		name: 'Cofcost',
// 	},
// 	originalPrice: 29000,
// 	description:
// 		'Pure Dak Lak cofcost is traditionally brewed with condensed milk to create a rich flavor, harmonizing the sweetness of the tip of the tongue and the elegant bitterness in the aftertaste.',
// 	size: [
// 		{
// 			name: 'Small',
// 			key: 'S',
// 			cost: 0,
// 		},
// 		{
// 			name: 'Medium',
// 			key: 'M',
// 			cost: 6000,
// 		},
// 		{
// 			name: 'Large',
// 			key: 'L',
// 			cost: 10000,
// 		},
// 	],
// 	topping: [
// 		{
// 			name: 'Macchiato Cream Cheese',
// 			cost: 10000,
// 		},
// 		{
// 			name: 'Shot Espresso',
// 			cost: 10000,
// 		},
// 		{
// 			name: 'White Pearl',
// 			cost: 10000,
// 		},
// 		{
// 			name: 'Caramel Sauce',
// 			cost: 10000,
// 		},
// 		{
// 			name: 'Cofcost Jelly',
// 			cost: 10000,
// 		},
// 	],
// }
// const output = Object.keys(data).reduce((result, field) => {
// 	const temp =
// 		typeof data[field] === 'object' ? JSON.stringify(data[field]) : data[field]
// 	result += `${field}:${temp}\n`
// 	return result
// }, '\n')
// console.log(output)
