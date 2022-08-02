import {DynamoDBClient, PutItemCommand, GetItemCommand} from '@aws-sdk/client-dynamodb'
import {withLocalClient} from "./lib/dynamodb.mjs";
import randomPassword from "./lib/random-password.mjs";

const insertCoach = async (username = 'admin', password = null) => {
    const coachPassword = await randomPassword(password)
    await withLocalClient(async (client) => {
        const coach = {
            TableName: 'Coach',
            Item: {
                Username: {
                    S: username
                },
                Password: {
                    S: coachPassword.hash
                },
                Description: {
                    S: 'hello'
                }
            }
        }

        await client.send(new PutItemCommand(coach))
    })

    console.log('Inserted coach:')
    console.dir({ username: username, password: coachPassword.raw })
}

await insertCoach('test', 'test')
