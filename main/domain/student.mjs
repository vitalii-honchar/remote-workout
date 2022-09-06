
class Student {

    constructor(id, coach, firstName, lastName) {
        this.id = id
        this.coach = coach
        this.firstName = firstName
        this.lastName = lastName
    }

    toString() {
        return `Student(id=${this.id}, coach=${this.coach}, firstName=${this.firstName}, lastName=${this.lastName})`
    }
}

export default Student
