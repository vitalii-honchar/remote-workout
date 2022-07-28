import fp from 'fastify-plugin'
import fastifyBasicAuth from "@fastify/basic-auth";

const authenticationPlugin = async function (fastify) {
    const validate = async function (username, password) {
        if (username !== 'Tyrion' || password !== 'wine') {
            return new Error('Winter is coming')
        }
    }
    fastify.register(fastifyBasicAuth, { validate: validate, authenticate: {} })

    fastify.after(() => fastify.addHook('onRequest', fastify.basicAuth))
}

export default fp(authenticationPlugin)
