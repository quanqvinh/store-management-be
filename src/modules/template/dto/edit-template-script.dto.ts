import * as Joi from 'joi'

export class EditTemplateScriptDto {
	script: string
}

export const EditTemplateScriptSchema = Joi.object<EditTemplateScriptDto>({
	script: Joi.string().required(),
})
