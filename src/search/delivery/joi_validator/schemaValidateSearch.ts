import Joi from "joi";

const schemaValidateSearch = Joi.object().keys({
    search_string: Joi.string()
        .min(2)
        .max(150)
        .required()
        .messages({
            'string.empty': 'El campo Busqueda no puede estar vacío',
            'string.min': 'El campo Busqueda no puede tener tan pocos caracteres',
            'string.max': 'El campo Busqueda solo puede tener 150 caracteres',
            'any.required': 'El campo Busqueda es requerido',
        }),
})

export default schemaValidateSearch