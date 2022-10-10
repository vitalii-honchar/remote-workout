import {ScheduledWorkout} from "../../domain/student.mjs"

export default class StudentService {

    constructor(studentRepository, log) {
        this.studentRepository = studentRepository
        this.log = log
    }

    async findAll(coach) {
        return await this.studentRepository.findAllByCoach(coach)
    }

    async findByCoachAndId(coach, id) {
        return await this.studentRepository.findByCoachAndId(coach, id)
    }

    async create(student) {
        this.log.info(`Create student: student = ${student}`)
        const lastIdInDatabase = await this.studentRepository.findLastId(student.coach)
        student.id = lastIdInDatabase ? lastIdInDatabase + 1 : 1
        await this.studentRepository.create(student)
        this.log.info(`Created student: student = ${student}`)
    }

    async update(student) {
        this.log.info(`Update student: student = ${student}`)

        const previousStudent = await this.findByCoachAndId(student.coach, student.id)
        let updateCandidate = student
        if (JSON.stringify(previousStudent.pricePlan) !== JSON.stringify(student.pricePlan)) {
            updateCandidate = student.updateWorkouts([])
        }

        await this.studentRepository.update(updateCandidate)
        this.log.info(`Updated student: student = ${updateCandidate}`)
    }

    async deleteByCoachAndId(coach, id) {
        this.log.info(`Delete student: coach = ${coach}, id = ${id}`)
        await this.studentRepository.delete(coach, id)
    }
}
