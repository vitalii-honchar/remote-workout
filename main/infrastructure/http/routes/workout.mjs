export default async (fastify) => {
    fastify.get('/workout', async (request, reply) => {
        return {
            workouts: [
                { id: 1, name: 'Test 1' },
                { id: 2, name: 'Test 2' }
            ]
        }
    })
}
