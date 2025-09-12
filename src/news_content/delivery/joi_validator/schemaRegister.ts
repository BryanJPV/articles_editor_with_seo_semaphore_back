import Joi from "joi";

const schemaValidateRegister = Joi.object().keys({
    position: Joi.number()
        .min(1)
        .required()
        .messages({
            'number.empty': 'El campo Posición no puede estar vacío',
            'number.min': 'El campo Posición no posee un valor correcto, debe ser un valor mayor de 1.',
            'any.required': 'El campo Posición es requerido',
        }),
    tipo: Joi.number()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.empty': 'El campo Tipo no puede estar vacío',
            'number.min': 'El campo Tipo no posee un valor correcto, debe ser un valor entre 1 y 5.',
            'any.required': 'El campo Tipo es requerido',
        }),
    /* descripcion: Joi.string()
        //.max(150)
        .required()
        .messages({
            'string.empty': 'El campo Descripción no puede estar vacío',
            //'string.max': 'El campo Descripción solo puede tener 150 caracteres',
            'any.required': 'El campo Descripción es requerido',
        }), */
    news_id: Joi.number()
        .min(1)
        .required()
        .messages({
            'number.empty': 'El campo NewsID no puede estar vacío',
            'number.min': 'El campo NewsID no posee un valor correcto, debe ser un valor mayor de 1.',
            'any.required': 'El campo NewsID es requerido',
        }),
})

export default schemaValidateRegister