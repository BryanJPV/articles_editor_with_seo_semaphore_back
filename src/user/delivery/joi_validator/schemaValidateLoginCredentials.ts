import Joi from "joi";

const schemaValidateLoginCredentials = Joi.object().keys({
    usermail: Joi.string()
        .min(2)
        .max(150)
        .required()
        .messages({
            'string.empty': 'El campo Mail de Usuario no puede estar vacío',
            'string.min': 'El campo Mail de Usuario no puede tener tan pocos caracteres',
            'string.max': 'El campo Mail de Usuario solo puede tener 150 caracteres',
            'any.required': 'El campo Mail de Usuario es requerido',
        }),
    password: Joi.string()
        .min(2)
        .max(150)
        .required()
        .messages({
            'string.empty': 'El campo Contraseña no puede estar vacío',
            'string.min': 'El campo Contraseña no puede tener tan pocos caracteres',
            'string.max': 'El campo Contraseña solo puede tener 150 caracteres',
            'any.required': 'El campo Contraseña es requerido',
        }),
})

export default schemaValidateLoginCredentials