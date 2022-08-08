
export default class PricePlanService {

    constructor(pricePlanRepository, log) {
        this.pricePlanRepository = pricePlanRepository
        this.log = log
    }

    async findAll(coach) {
        return await this.pricePlanRepository.findAllByCoach(coach)
    }

    async findByCoachAndName(coach, name) {
        return await this.pricePlanRepository.findByCoachAndName(coach, name)
    }

    async create(pricePlan) {
        this.log.info(`Create price plan: pricePlan = ${JSON.stringify(pricePlan)}`)
        await this.pricePlanRepository.create(pricePlan)
        this.log.info(`Created price plan: pricePlan = ${JSON.stringify(pricePlan)}`)
    }

    async update(pricePlan) {
        this.log.info(`Update price plan: pricePlan = ${JSON.stringify(pricePlan)}`)
        await this.pricePlanRepository.update(pricePlan)
        this.log.info(`Updated price plan: pricePlan = ${JSON.stringify(pricePlan)}`)
    }

    async deleteByCoachAndName(coach, name) {
        this.log.info(`Delete price plan: coach = ${coach}, name = ${name}`)
        await this.pricePlanRepository.delete(coach, name)
    }
}
