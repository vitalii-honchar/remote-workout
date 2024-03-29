import {diContainer} from "@fastify/awilix";
import Workout from "../../../domain/workout.mjs"
import {WorkoutVideo} from "../../../domain/workout.mjs"

export default async (fastify) => {
    const workoutService = diContainer.resolve("workoutService")
    const httpSession = (request) => request.diScope.resolve('httpSession')
    const successResponse = () => { return { success: true } }

    const createWorkout = (body, coach) => {
        const videos = body.videos ? body.videos.map(v => new WorkoutVideo(v.link)) : []
        return new Workout(coach, body.id, body.name, body.description, videos)
    }

    fastify.get('/workout', async (request) => {
        return await workoutService.findAll(httpSession(request).coach)
    })

    fastify.get('/workout/:id', async (request) => {
        const {id} = request.params
        return await workoutService.findByCoachAndId(httpSession(request).coach, parseInt(id))
    })

    fastify.put('/workout', async (request) => {
        const workout = createWorkout(request.body, httpSession(request).coach)
        await workoutService.create(workout)
        return successResponse()
    })

    fastify.post('/workout/:id', async (request) => {
        const workout = createWorkout(request.body, httpSession(request).coach)
        const {id} = request.params
        workout.id = parseInt(id)
        await workoutService.update(workout)
        return successResponse()
    })

    fastify.delete('/workout/:id', async (request) => {
        const {id} = request.params
        await workoutService.deleteByCoachAndCreatedAt(httpSession(request).coach, parseInt(id))
        return successResponse()
    })
}
