
class Student {

    constructor(id, coach, firstName, lastName, pricePlan, workouts) {
        this.id = id
        this.coach = coach
        this.firstName = firstName
        this.lastName = lastName
        this.pricePlan = pricePlan
        this.workouts = workouts
    }

    toString() {
        return `Student(id=${this.id}, coach=${this.coach}, firstName=${this.firstName}, lastName=${this.lastName}` +
            `, pricePlan=${this.pricePlan}, workouts=${this.workouts})`
    }
}

class WorkoutPricePlan {

    constructor(workouts, price) {
        this.workouts = workouts
        this.price = price
    }

    toString() {
        return `WorkoutPricePlan(workouts=${this.workouts}, price=${this.price})`
    }
}

class ScheduledWorkout {

    constructor(workoutId, order, scheduledTime, sent) {
        this.workoutId = workoutId
        this.order = order
        this.scheduledTime = scheduledTime
        this.sent = sent
    }

    toString() {
        return `ScheduledWorkout(workoutId=${this.workoutId}, order=${this.order},` +
            `scheduledTime=${this.scheduledTime}, sent=${this.sent})`
    }
}

export default Student
export {WorkoutPricePlan, ScheduledWorkout}
