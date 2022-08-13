class Workout {
    constructor(coach, id, name, description, videos) {
        this.coach = coach
        this.id = id
        this.name = name
        this.description = description
        this.videos = videos
    }

    toString() {
        return `Workout(coach=${this.coach}, id=${this.id}, name=${this.name}, description=${this.description}, videos=${this.videos})`
    }
}

class WorkoutVideo {

    constructor(link) {
        this.link = link
    }

    toString() {
        return `WorkoutVideo(link=${this.link})`
    }
}

export default Workout

export {WorkoutVideo}
