import Joi from "joi";

const schemaValidateUpdate = Joi.object().keys({
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
})

export default schemaValidateUpdate