import bcrypt from 'bcrypt'

export default class AuthenticationService {
    constructor(coachRepository, log) {
        this.coachRepository = coachRepository
        this.log = log
    }

    async authenticate(username, password) {
        this.log.info(`Authenticate: username = ${username}, password = ${password}`)
        const coach = await this.coachRepository.findByUsername(username)
        if (coach === null || !(await bcrypt.compare(password, coach.password))) {
            return Error("Unauthenticated")
        }
        this.log.info(`Authentication success username = ${username}, password = ${password}`)
    }
}
