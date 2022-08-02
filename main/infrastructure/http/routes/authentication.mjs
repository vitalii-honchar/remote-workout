
export default async (fastify) => {
    fastify.get('/auth/login', async function (request, reply) {
        return { success: true }
    })
}
