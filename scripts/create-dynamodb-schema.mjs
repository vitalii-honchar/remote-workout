import {CreateTableCommand, DynamoDBClient, ListTablesCommand} from '@aws-sdk/client-dynamodb'

const tables = [
    {
        AttributeDefinitions: [
            {
                AttributeName: "Season", //ATTRIBUTE_NAME_1
                AttributeType: "N", //ATTRIBUTE_TYPE
            },
            {
                AttributeName: "Episode", //ATTRIBUTE_NAME_2
                AttributeType: "N", //ATTRIBUTE_TYPE
            },
        ],
        KeySchema: [
            {
                AttributeName: "Season", //ATTRIBUTE_NAME_1
                KeyType: "HASH",
            },
            {
                AttributeName: "Episode", //ATTRIBUTE_NAME_2
                KeyType: "RANGE",
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
        TableName: "TEST_TABLE", //TABLE_NAME
        StreamSpecification: {
            StreamEnabled: false,
        },
    }
]

const createSchema = async (configuration) => {
    const client = new DynamoDBClient(configuration);
    const getExistsTables = async () => {
        const response = await client.send(new ListTablesCommand({}))
        return response['TableNames']
    }

    console.log('Creation DynamoDB schema...')
    try {
        const existsTables = await getExistsTables()

        for (const table of tables) {
            if (!existsTables.includes(table['TableName'])) {
                console.log(`Creation table ${table['TableName']}`)
                await client.send(new CreateTableCommand(table))
            }
        }
        console.log('DynamoDB schema created.')
    } catch (err) {
        console.error(err);
    }
}

await createSchema({
    endpoint: "http://localhost:8000",
    region: "eu-west-3",
    credentials: {
        accessKeyId: 'AKIARJNULBG3CS7AGQ7M',
        secretAccessKey: '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'
    }
})
