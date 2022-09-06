import {diContainer} from "@fastify/awilix";
import Student from "../../../domain/student.mjs"
import {successResponse} from "../../../lib/responses.mjs"

export default async (fastify) => {
    const studentService = diContainer.resolve('studentService')
    const httpSession = (request) => request.diScope.resolve('httpSession')

    const createStudent = (body, coach) => {
        return new Student(body.id || null, coach, body.firstName, body.lastName)
    }

    fastify.get('/student', async function (request) {
        return await studentService.findAll(httpSession(request).coach)
    })

    fastify.get('/student/:id', async function (request) {
        const {id} = request.params
        return await studentService.findByCoachAndId(httpSession(request).coach, id)
    })

    fastify.put('/student', async function (request) {
        const student = createStudent(request.body, httpSession(request).coach)
        await studentService.create(student)
        return successResponse()
    })

    fastify.post('/student/:id', async function (request) {
        const {id} = request.params
        const student = createStudent(request.body, httpSession(request).coach)
        student.id = parseInt(id)
        await studentService.update(student)
        return successResponse()
    })

    fastify.delete('/student/:id', async function (request) {
        const {id} = request.params
        await studentService.deleteByCoachAndId(httpSession(request).coach, id)
        return successResponse()
    })
}
