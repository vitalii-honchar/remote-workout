'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

module.exports = async function (fastify, opts) {

    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'infrastructure/http/plugins'),
        options: Object.assign({}, opts)
    })

    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'infrastructure/http/routes'),
        options: Object.assign({}, opts)
    })
}
