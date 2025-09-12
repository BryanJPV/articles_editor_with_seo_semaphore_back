import Joi from "joi";

const schemaValidateChangePassword = Joi.object().keys({
    old_password: Joi.string()
        .min(5)
        .max(150)
        .required()
        .messages({
            'string.empty': 'El campo Contraseña Anterior no puede estar vacío',
            'string.min': 'El campo Contraseña Anterior no puede tener tan pocos caracteres',
            'string.max': 'El campo Contraseña Anterior solo puede tener 150 caracteres',
            'any.required': 'El campo Contraseña Anterior es requerido',
        }),
    new_password: Joi.string()
        .min(5)
        .max(150)
        .required()
        .messages({
            'string.empty': 'El campo Nueva Contraseña no puede estar vacío',
            'string.min': 'El campo Nueva Contraseña no puede tener tan pocos caracteres',
            'string.max': 'El campo Nueva Contraseña solo puede tener 150 caracteres',
            'any.required': 'El campo Nueva Contraseña es requerido',
        }),
    /* remember_token: Joi.string()
        .min(2)
        .max(150)
        .required()
        .messages({
            'string.empty': 'El campo Remember Token no puede estar vacío',
            'string.min': 'El campo Remember Token no puede tener tan pocos caracteres',
            'string.max': 'El campo Remember Token solo puede tener 150 caracteres',
            'any.required': 'El campo Remember Token es requerido',
        }), */
})

export default schemaValidateChangePassword