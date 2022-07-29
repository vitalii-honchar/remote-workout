import {GetItemCommand} from "@aws-sdk/client-dynamodb";
import Coach from "../../../domain/coach.mjs";

const TABLE_COACH = 'Coach'

function convertItemToCoach(item) {
    return new Coach(item.Username.S, item.Password.S)
}

export default class CoachRepository {

    constructor(dynamoDb, log) {
        this.dynamoDb = dynamoDb
        this.log = log
    }

    async findByUsername(username) {
        const query = {
            TableName: TABLE_COACH,
            Key: {
                Username: {
                    S: username
                }
            }
        }
        this.log.info(`Find by username: username = ${username}`)
        const result = await this.dynamoDb.send(new GetItemCommand(query))
        const coach = convertItemToCoach(result.Item)
        this.log.info(`Found by username: username = ${username}, result = ${JSON.stringify(coach)}`)
        return coach
    }
}
