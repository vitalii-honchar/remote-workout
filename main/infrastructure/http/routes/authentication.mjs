
export default async (fastify) => {
    fastify.get('/auth/login', async function (request, reply) {
        return { login: true }
    })
    fastify.get('/auth/logout', async function (request, reply) {
        return { logout: true }
    })
}
