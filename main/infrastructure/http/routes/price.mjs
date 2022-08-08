import {diContainer} from "@fastify/awilix";
import PricePlan from "../../../domain/price-plan.mjs"

export default async (fastify) => {
    const pricePlanService = diContainer.resolve('pricePlanService')
    const httpSession = (request) => request.diScope.resolve('httpSession')
    const successResponse = () => { return { success: true } }

    const createPricePlan = (body) => {
        return new PricePlan(body.coach, body.name, body.price, body.workouts)
    }

    fastify.get('/price', async function (request) {
        return await pricePlanService.findAll(httpSession(request).coach)
    })

    fastify.get('/price/:name', async function (request) {
        const {name} = request.params
        return await pricePlanService.findByCoachAndName(httpSession(request).coach, name)
    })

    fastify.put('/price', async function (request) {
        const pricePlan = createPricePlan(request.body)
        await pricePlanService.create(pricePlan)
        return successResponse()
    })

    fastify.post('/price/:name', async function (request) {
        const pricePlan = createPricePlan(request.body)
        await pricePlanService.update(pricePlan)
        return {success: true}
    })

    fastify.delete('/price/:name', async function (request) {
        const {name} = request.params
        await pricePlanService.deleteByCoachAndName(httpSession(request).coach, name)
        return successResponse()
    })
}
