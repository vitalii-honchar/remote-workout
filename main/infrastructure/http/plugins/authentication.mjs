import fp from 'fastify-plugin'
import fastifyBasicAuth from "@fastify/basic-auth";
import {diContainer} from "@fastify/awilix";

const authenticationPlugin = async function (fastify) {
    const validate = async function (username, password) {
        return await diContainer.resolve('authenticationService')
            .authenticate(username, password)
    }
    fastify.register(fastifyBasicAuth, { validate: validate, authenticate: {} })

    fastify.after(() => fastify.addHook('onRequest', fastify.basicAuth))
}

export default fp(authenticationPlugin)
