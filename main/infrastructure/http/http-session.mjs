
export default class HttpSession {

    constructor(coach) {
        this.coach = coach
    }

    toString() {
        return `HttpSession(coach=${this.coach})`
    }
}
