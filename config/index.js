// config/index.js

'use strict'

const joi = require('joi');

// CONFIGURATION SCHEMA! EDIT HERE!
const envVarsSchema = joi.object({
        NODE_ENV: joi.string()
            .allow(['development', 'production', 'test', 'provision'])
            .required(),
        PORT: joi.number()
            .required()
    }).unknown()
    .required()

// Validation
const joival = joi.validate(process.env, envVarsSchema);
if (joival.error) {throw new Error(`Config validation error: ${joival.error.message}`)};
const envVars = joival.value;

// Exporting config values
const config = {
    env: envVars.NODE_ENV,
    logger: {
        level: envVars.LOGGER_LEVEL,
        enabled: envVars.LOGGER_ENABLED
    },
    server: {
        port: envVars.PORT
    }
}

module.exports = config;
