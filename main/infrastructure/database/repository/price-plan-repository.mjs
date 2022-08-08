import {QueryCommand} from "@aws-sdk/client-dynamodb"
import PricePlan from "../../../domain/price-plan.mjs"

const TABLE_PRICE_PLAN = 'PricePlan'

const convertItemToPricePlan = (item) => new PricePlan(item.Coach.S, item.Name.S, item.Price.N, item.Workouts.N)

export default class PricePlanRepository {

    constructor(dynamoDb, log) {
        this.dynamoDb = dynamoDb
        this.log = log
    }

    async findAllByCoach(coach) {
        const query = {
            TableName: TABLE_PRICE_PLAN,
            KeyConditionExpression: "Coach = :coach",
            ExpressionAttributeValues: {
                ":coach": { S: coach }
            }
        }
        this.log.info(`Find price plan by coach: coach = ${coach}`)
        const result = await this.dynamoDb.send(new QueryCommand(query))
        const pricePlans = result.Items.map(item => convertItemToPricePlan(item))
        this.log.info(`Found price plan by coach: coach = ${coach}, result = ${JSON.stringify(pricePlans)}`)
        return pricePlans
    }
}
