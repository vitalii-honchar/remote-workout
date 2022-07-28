import {DynamoDBClient, PutItemCommand, GetItemCommand} from '@aws-sdk/client-dynamodb'

const withClient = async (configuration, f) => {
    const client = new DynamoDBClient(configuration);

    try {
        await f(client)
    } catch (err) {
        console.error(err);
    }
}

const insertCoach = async (configuration) => {
    await withClient(configuration, async (client) => {
        const item1 = {
            TableName: 'Coach',
            Item: {
                Username: {
                    S: 'weaxme'
                },
                Password: {
                    S: 'test'
                },
                Description: {
                    S: 'hello'
                }
            }
        }
        const item2 = {
            TableName: 'Coach',
            Item: {
                Username: {
                    S: 'george'
                },
                Password: {
                    S: 'test2'
                },
                Description: {
                    S: 'hello2'
                }
            }
        }

        await client.send(new PutItemCommand(item1))
        await client.send(new PutItemCommand(item2))
    })
}

const readCoach = async (configuration) => {
    await withClient(configuration, async client => {
        const query = {
            TableName: 'Coach',
            Key: {
                Username: {
                    S: 'weaxme'
                }
            }
        }
        const res = await client.send(new GetItemCommand(query))
        console.dir(res['Item'])
    })
}

await readCoach({
    endpoint: "http://localhost:8000",
    region: "eu-west-3",
    credentials: {
        accessKeyId: 'AKIARJNULBG3CS7AGQ7M',
        secretAccessKey: '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'
    }
})
