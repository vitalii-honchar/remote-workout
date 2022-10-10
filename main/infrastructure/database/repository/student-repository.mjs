import {
    DeleteItemCommand,
    GetItemCommand,
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb"
import Student, {ScheduledWorkout, WorkoutPricePlan} from "../../../domain/student.mjs"
import {parse} from "ts-jest"

const TABLE_STUDENT = 'Student'

const createPricePlan = (pricePlan) => {
    if (pricePlan != null && Object.keys(pricePlan.M).length !== 0) {
        return new WorkoutPricePlan(
            parseInt(pricePlan.M.Workouts.N),
            parseInt(pricePlan.M.Price.N),
            pricePlan.M.Name.S
        )
    }
    return null
}

const createWorkouts = (workouts) => {
    if (workouts == null) {
        return []
    }
    return workouts.L.map(workout =>
        new ScheduledWorkout(
            parseInt(workout.M.WorkoutId.N),
            null,
            new Date(parseInt(workout.M.ScheduledTime.N)),
            Boolean(workout.M.Sent.BOOL)
        )
    )
}

const convertItemToStudent = (item) => new Student(
    parseInt(item.Id.N),
    item.Coach.S,
    item.FirstName.S,
    item.LastName.S,
    createPricePlan(item.PricePlan),
    createWorkouts(item.Workouts)
)

export default class StudentRepository {
    constructor(dynamoDb, log) {
        this.dynamoDb = dynamoDb
        this.log = log
    }

    async create(student) {
        const command = {
            TableName: TABLE_STUDENT,
            Item: {
                Coach: {S: student.coach},
                Id: {N: `${student.id}`},
                FirstName: {S: student.firstName},
                LastName: {S: student.lastName},
                PricePlan: {M: {}},
                Workouts: {L: []}
            }
        }
        return this.dynamoDb.send(new PutItemCommand(command))
    }

    async findLastId(coach) {
        const query = {
            TableName: TABLE_STUDENT,
            KeyConditionExpression: "Coach = :coach",
            ExpressionAttributeValues: {
                ":coach": {S: coach}
            },
            ProjectionExpression: "Id",
            ScanIndexForward: false,
            Limit: 1
        }
        const result = await this.dynamoDb.send(new QueryCommand(query))
        return result.Items.length > 0 ? parseInt(result.Items[0].Id.N) : null
    }

    async findAllByCoach(coach) {
        const query = {
            TableName: TABLE_STUDENT,
            KeyConditionExpression: "Coach = :coach",
            ExpressionAttributeValues: {
                ":coach": {S: coach}
            }
        }
        const result = await this.dynamoDb.send(new QueryCommand(query))
        return result.Items.map(it => convertItemToStudent(it))
    }

    async findByCoachAndId(coach, id) {
        const query = {
            TableName: TABLE_STUDENT,
            Key: {
                Coach: {S: coach},
                Id: {N: `${id}`}
            }
        }
        const result = await this.dynamoDb.send(new GetItemCommand(query))
        return convertItemToStudent(result.Item)
    }

    async update(student) {
        const command = {
            TableName: TABLE_STUDENT,
            Key: {
                Coach: {S: student.coach},
                Id: {N: `${student.id}`}
            },
            UpdateExpression: "set FirstName = :firstName, LastName = :lastName, " +
                "PricePlan = :pricePlan, Workouts = :workouts",
            ExpressionAttributeValues: {
                ":firstName": {S: student.firstName},
                ":lastName": {S: student.lastName},
                ":pricePlan": {
                    M: {
                        "Workouts": {N: `${student.pricePlan.workouts}`},
                        "Price": {N: `${student.pricePlan.price}`},
                        "Name": {S: student.pricePlan.name}
                    },
                },
                ":workouts": {
                    L: student.workouts.map(workout => {
                        return {
                            M: {
                                "WorkoutId": { N: `${workout.workoutId}` },
                                "ScheduledTime": { N: `${workout.scheduledTime.getTime()}` },
                                "Sent": { BOOL: `${workout.sent}` }
                            }
                        }
                    })
                }
            },
            ReturnValues: 'ALL_NEW'
        }
        return await this.dynamoDb.send(new UpdateItemCommand(command))
    }

    async delete(coach, id) {
        const command = {
            TableName: TABLE_STUDENT,
            Key: {
                Coach: {S: coach},
                Id: {N: `${id}`}
            }
        }

        return await this.dynamoDb.send(new DeleteItemCommand(command))
    }
}
