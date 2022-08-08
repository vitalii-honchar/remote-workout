
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
}
