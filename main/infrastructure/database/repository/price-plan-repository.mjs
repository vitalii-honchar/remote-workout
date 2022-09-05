import {
    DeleteItemCommand,
    GetItemCommand,
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb"
import PricePlan from "../../../domain/price-plan.mjs"

const TABLE_PRICE_PLAN = 'PricePlan'

const convertItemToPricePlan = (item) => new PricePlan(item.Coach.S, item.Name.S, item.Price.N, item.Workouts.N)

const convertPricePlanToItem = (pricePlan) => {
    return {
        Coach: {
            S: pricePlan.coach
        },
        Name: {
            S: pricePlan.name
        },
        Price: {
            N: pricePlan.price
        },
        Workouts: {
            N: pricePlan.workouts
        }
    }
}

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
                ":coach": {S: coach}
            }
        }
        const result = await this.dynamoDb.send(new QueryCommand(query))
        return result.Items.map(item => convertItemToPricePlan(item))
    }

    async findByCoachAndName(coach, name) {
        const query = {
            TableName: TABLE_PRICE_PLAN,
            Key: {
                Coach: {
                    S: coach
                },
                Name: {
                    S: name
                }
            }
        }
        const result = await this.dynamoDb.send(new GetItemCommand(query))
        return convertItemToPricePlan(result.Item)
    }

    async create(pricePlan) {
        const query = {
            TableName: TABLE_PRICE_PLAN,
            Item: convertPricePlanToItem(pricePlan)
        }
        return this.dynamoDb.send(new PutItemCommand(query))
    }

    async update(pricePlan) {
        const query = {
            TableName: TABLE_PRICE_PLAN,
            Key: {
                Coach: {
                    S: pricePlan.coach
                },
                Name: {
                    S: pricePlan.name
                }
            },
            UpdateExpression: "set Price = :price, Workouts = :workouts",
            ExpressionAttributeValues: {
                ":price": {
                    N: `${pricePlan.price}`
                },
                ":workouts": {
                    N: `${pricePlan.workouts}`
                }
            },
            ReturnValues: 'ALL_NEW'
        }
        return this.dynamoDb.send(new UpdateItemCommand(query))
    }

    async delete(coach, name) {
        const query = {
            TableName: TABLE_PRICE_PLAN,
            Key: {
                Coach: {
                    S: coach
                },
                Name: {
                    S: name
                }
            }
        }
        return this.dynamoDb.send(new DeleteItemCommand(query))
    }
}
