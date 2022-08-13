
export default class WorkoutService {

    constructor(workoutRepository, log) {
        this.workoutRepository = workoutRepository
        this.log = log
    }

    async findAll(coach) {
        return await this.workoutRepository.findAll(coach)
    }

    async findByCoachAndId(coach, id) {
        return await this.workoutRepository.findByCoachAndId(coach, id)
    }

    async create(workout) {
        this.log.info(`Create workout: workout = ${workout}`)
        const lastIdInDatabase = await this.workoutRepository.findLastId(workout.coach)
        workout.id = lastIdInDatabase ? lastIdInDatabase + 1 : 1
        await this.workoutRepository.create(workout)
        this.log.info(`Created workout: workout = ${workout}`)
    }

    async update(workout) {
        this.log.info(`Update workout: workout = ${workout}`)
        await this.workoutRepository.update(workout)
        this.log.info(`Updated workout: workout = ${workout}`)
    }

    async deleteByCoachAndCreatedAt() {

    }
}
