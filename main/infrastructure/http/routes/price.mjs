import {diContainer} from "@fastify/awilix";

export default async (fastify) => {
    const pricePlanService = diContainer.resolve('pricePlanService')

    const httpSession = (request) => request.diScope.resolve('httpSession')

    fastify.get('/price', async function (request) {
        return await pricePlanService.findAll(httpSession(request).coach)
    })
}
