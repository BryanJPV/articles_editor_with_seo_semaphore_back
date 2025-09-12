import Joi from "joi";

const schemaValidateRegister = Joi.object().keys({
    titulo: Joi.string()
        .max(150)
        .required()
        .messages({
            'string.empty': 'El campo Título no puede estar vacío',
            'string.max': 'El campo Título solo puede tener 150 caracteres',
            'any.required': 'El campo Título es requerido',
        }),

    subtitulo: Joi.string()
        .max(250)
        .required()
        .messages({
            'string.empty': 'El campo Subtítulo no puede estar vacío',
            'string.max': 'El campo Subtítulo solo puede tener 250 caracteres',
            'any.required': 'El campo Subtítulo es requerido',
        }),
    seo_url: Joi.string()
        .max(200)
        .required()
        .messages({
            'string.empty': 'El campo Seo URL no puede estar vacío',
            'string.max': 'El campo Seo URL solo puede tener 200 caracteres',
            'any.required': 'El campo Seo URL es requerido',
        }),
    keywords: Joi.string()
        .max(200)
        .required()
        .messages({
            'string.empty': 'El campo Keywords/Palabras clave no puede estar vacío',
            'string.max': 'El campo Keywords/Palabras clave solo puede tener 200 caracteres',
            'any.required': 'El campo Keywords/Palabras clave es requerido',
        }),
    status: Joi.number()
        .min(0)
        .max(1)
        .required()
        .messages({
            'number.empty': 'El campo Status no puede estar vacío',
            'number.min': 'El campo Status no posee un valor correcto, debe ser un valor entre 0 y 1.',
            'number.max': 'El campo Status no posee un valor correcto, debe ser un valor entre 0 y 1.',
            'any.required': 'El campo Status es requerido',
        }),
})

export default schemaValidateRegister