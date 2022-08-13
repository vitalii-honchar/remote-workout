import fp from 'fastify-plugin'
import {fastifyAwilixPlugin, diContainer} from "@fastify/awilix";
import {asClass, asValue, Lifetime, InjectionMode, asFunction} from "awilix";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {createHttpSessionResolver} from "./authentication.mjs"

const readConfig = () => {
    const readDynamoDbConfig = () => {
        const config = {
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY
            }
        }
        if (process.env.DYNAMO_DB_ENDPOINT) {
            config.endpoint = process.env.DYNAMO_DB_ENDPOINT
        }
        return config
    }

    return {
        dynamoDbConfig: readDynamoDbConfig()
    }
}

const dependecyInjection = async function (fastify) {
    fastify.register(fastifyAwilixPlugin, {disposeOnClose: true, disposeOnResponse: true})

    await diContainer.loadModules(
        [
            'main/infrastructure/database/**/*.mjs',
            'main/application/**/*.mjs',
        ],
        {
            formatName: 'camelCase',
            resolverOptions: {
                lifetime: Lifetime.SINGLETON,
                injectionMode: InjectionMode.CLASSIC,
                register: asClass
            },
            esModules: true
        },
    )

    await diContainer.register({
        log: asValue(fastify.log),
        config: asValue(readConfig()),
        dynamoDb: asFunction(({config}) =>  new DynamoDBClient(config.dynamoDb))
            .disposer(client => client.destroy())
    })

    fastify.addHook('onRequest', createHttpSessionResolver())
}

export default fp(dependecyInjection)
