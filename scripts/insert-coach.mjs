import {DynamoDBClient, PutItemCommand, GetItemCommand} from '@aws-sdk/client-dynamodb'
import {withLocalClient} from "./lib/dynamodb.mjs";
import randomPassword from "./lib/random-password.mjs";

const insertCoach = async () => {
    const username = 'admin'
    const password = await randomPassword()
    await withLocalClient(async (client) => {
        const coach = {
            TableName: 'Coach',
            Item: {
                Username: {
                    S: username
                },
                Password: {
                    S: password.hash
                },
                Description: {
                    S: 'hello'
                }
            }
        }

        await client.send(new PutItemCommand(coach))
    })

    console.log('Inserted coach:')
    console.dir({ username: username, password: password.raw })
}

await insertCoach()
