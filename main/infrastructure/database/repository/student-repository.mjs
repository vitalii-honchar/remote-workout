import {
    DeleteItemCommand,
    GetItemCommand,
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb"
import Student from "../../../domain/student.mjs"

const TABLE_STUDENT = 'Student'

const convertItemToStudent = (item) => new Student(
    parseInt(item.Id.N),
    item.Coach.S,
    item.FirstName.S,
    item.LastName.S
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
                LastName: {S: student.lastName}
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
            UpdateExpression: "set FirstName = :firstName, LastName = :lastName",
            ExpressionAttributeValues: {
                ":firstName": { S: student.firstName},
                ":lastName": { S: student.lastName }
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
