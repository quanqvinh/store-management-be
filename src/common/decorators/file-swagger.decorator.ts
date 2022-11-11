import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export function ApiPropertyFile() {
	return applyDecorators(ApiProperty({ type: 'string', format: 'binary' }))
}

export function ApiPropertyMultiFiles() {
	return applyDecorators(
		ApiProperty({
			type: 'array',
			items: { type: 'string', format: 'binary' },
		})
	)
}
