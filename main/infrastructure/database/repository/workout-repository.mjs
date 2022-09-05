import {
    DeleteItemCommand,
    GetItemCommand,
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb"
import Workout, {WorkoutVideo} from "../../../domain/workout.mjs"

const TABLE_WORKOUT = 'Workout'

const convertItemToWorkout = (item) => new Workout(
    item.Coach.S,
    parseInt(item.Id.N),
    item.Name.S,
    item.Description.S,
    item.Videos.SS.map(v => new WorkoutVideo(v))
)

export default class WorkoutRepository {
    constructor(dynamoDb, log) {
        this.dynamoDb = dynamoDb
        this.log = log
    }

    async create(workout) {
        const command = {
            TableName: TABLE_WORKOUT,
            Item: {
                Coach: {S: workout.coach},
                Id: {N: `${workout.id}`},
                Name: {S: workout.name},
                Description: {S: workout.description},
                Videos: {SS: workout.videos.map(v => v.link)}
            }
        }
        return this.dynamoDb.send(new PutItemCommand(command))
    }

    async findLastId(coach) {
        const query = {
            TableName: TABLE_WORKOUT,
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

    async findAll(coach) {
        const query = {
            TableName: TABLE_WORKOUT,
            KeyConditionExpression: "Coach = :coach",
            ExpressionAttributeValues: {
                ":coach": {S: coach}
            }
        }
        const result = await this.dynamoDb.send(new QueryCommand(query))
        return result.Items.map(it => convertItemToWorkout(it))
    }

    async findByCoachAndId(coach, id) {
        const query = {
            TableName: TABLE_WORKOUT,
            Key: {
                Coach: { S: coach },
                Id: { N: id }
            }
        }
        const result = await this.dynamoDb.send(new GetItemCommand(query))
        return convertItemToWorkout(result.Item)
    }

    async update(workout) {
        const command = {
            TableName: TABLE_WORKOUT,
            Key: {
                Coach: { S: workout.coach },
                Id: { N: workout.id }
            },
            UpdateExpression: "set #n = :name, Description = :description, Videos = :videos",
            ExpressionAttributeValues: {
                ":name": { S: workout.name},
                ":description": { S: workout.description },
                ":videos": { SS: workout.videos.map(v => v.link) }
            },
            ExpressionAttributeNames: {
                "#n": "Name"
            },
            ReturnValues: 'ALL_NEW'
        }
        return await this.dynamoDb.send(new UpdateItemCommand(command))
    }

    async delete(coach, id) {
        const command = {
            TableName: TABLE_WORKOUT,
            Key: {
                Coach: { S: coach },
                Id: { N: id }
            }
        }

        return await this.dynamoDb.send(new DeleteItemCommand(command))
    }
}
