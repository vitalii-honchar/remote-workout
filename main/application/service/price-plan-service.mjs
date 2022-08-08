
export default class PricePlanService {

    constructor(pricePlanRepository, log) {
        this.pricePlanRepository = pricePlanRepository
        this.log = log
    }

    async findAll(coach) {
        return await this.pricePlanRepository.findAllByCoach(coach)
    }
}
