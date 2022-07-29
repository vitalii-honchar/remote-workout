import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

const withClient = async (configuration, f) => {
    const client = new DynamoDBClient(configuration);

    try {
        await f(client)
    } catch (err) {
        console.error(err);
    }
}

const withLocalClient = async (f) => {
    const opts = {
        endpoint: "http://localhost:8000",
        region: "eu-west-3",
        credentials: {
            accessKeyId: 'AKIARJNULBG3CS7AGQ7M',
            secretAccessKey: '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'
        }
    }
    await withClient(opts, f)
}

export {withClient, withLocalClient}
