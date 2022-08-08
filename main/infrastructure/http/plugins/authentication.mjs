import fp from 'fastify-plugin'
import fastifyBasicAuth from "@fastify/basic-auth";
import {diContainer} from "@fastify/awilix";
import {asValue} from "awilix"
import HttpSession from "../http-session.mjs"

const authenticationPlugin = async function (fastify) {
    const validate = async function (username, password) {
        return await diContainer.resolve('authenticationService')
            .authenticate(username, password)
    }
    fastify.register(fastifyBasicAuth, { validate: validate, authenticate: false })

    fastify.after(() => fastify.addHook('onRequest', fastify.basicAuth))
}

const createHttpSessionResolver = () => {
    return (request, reply, done) => {
        const usernameAndPassword = atob(request.headers['authorization'].split(' ')[1])
        request.diScope.register({
            httpSession: asValue(new HttpSession(usernameAndPassword.split(":")[0]))
        })
        done()
    }
}

export default fp(authenticationPlugin)

export {createHttpSessionResolver}
