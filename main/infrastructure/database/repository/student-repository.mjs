import {
    DeleteItemCommand,
    GetItemCommand,
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb"
import Student, {WorkoutPricePlan} from "../../../domain/student.mjs"

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

const convertItemToStudent = (item) => new Student(
    parseInt(item.Id.N),
    item.Coach.S,
    item.FirstName.S,
    item.LastName.S,
    createPricePlan(item.PricePlan)
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
                PricePlan: {M: {}}
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
                Coach: { S: coach },
                Id: { N: `${id}` }
            }
        }
        const result = await this.dynamoDb.send(new GetItemCommand(query))
        return convertItemToStudent(result.Item)
    }

    async update(student) {
        const command = {
            TableName: TABLE_STUDENT,
            Key: {
                Coach: { S: student.coach },
                Id: { N: `${student.id}` }
            },
            UpdateExpression: "set FirstName = :firstName, LastName = :lastName, " +
                "PricePlan.Workouts = :workouts, PricePlan.Price = :price, PricePlan.#name = :name",
            ExpressionAttributeNames: {
                "#name": "Name"
            },
            ExpressionAttributeValues: {
                ":firstName": { S: student.firstName},
                ":lastName": { S: student.lastName },
                ":workouts": { N: student.pricePlan.workouts },
                ":price": { N: student.pricePlan.price },
                ":name": { S: student.pricePlan.name }
            },
            ReturnValues: 'ALL_NEW'
        }
        return await this.dynamoDb.send(new UpdateItemCommand(command))
    }

    async delete(coach, id) {
        const command = {
            TableName: TABLE_STUDENT,
            Key: {
                Coach: { S: coach },
                Id: { N: `${id}` }
            }
        }

        return await this.dynamoDb.send(new DeleteItemCommand(command))
    }
}
