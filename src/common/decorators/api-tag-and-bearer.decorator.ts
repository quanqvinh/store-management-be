import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

export function ApiTagsAndBearer(...tags: string[]) {
	return applyDecorators(
		ApiBearerAuth(), //
		ApiTags(...tags)
	)
}
