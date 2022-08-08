import {DynamoDBClient, PutItemCommand, GetItemCommand} from '@aws-sdk/client-dynamodb'
import {withLocalClient} from "./lib/dynamodb.mjs";
import randomPassword from "./lib/random-password.mjs";

const insertPricePlan = async (coach, pricePlanName) => {
    await withLocalClient(async (client) => {
        const pricePlan = {
            TableName: 'PricePlan',
            Item: {
                Coach: {
                    S: coach
                },
                Name: {
                    S: pricePlanName
                },
                Price: {
                    N: Math.random() * 100
                },
                Workouts: {
                    N: Math.random() * 100
                }
            }
        }

        await client.send(new PutItemCommand(pricePlan))
    })

    console.log('Inserted price plan.')
}

await insertPricePlan('test', 'test-price-' + Math.trunc(Math.random() * 100))
