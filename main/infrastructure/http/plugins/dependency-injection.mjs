import fp from 'fastify-plugin'
import {fastifyAwilixPlugin, diContainer} from "@fastify/awilix";
import {asClass, asValue, Lifetime, InjectionMode, asFunction} from "awilix";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

const dependecyInjection = async function (fastify) {
    fastify.register(fastifyAwilixPlugin, {disposeOnClose: true, disposeOnResponse: false})

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
        dynamoDb: asFunction(() =>
            new DynamoDBClient(
                {
                    endpoint: "http://localhost:8000",
                    region: "eu-west-3",
                    credentials: {
                        accessKeyId: 'AKIARJNULBG3CS7AGQ7M',
                        secretAccessKey: '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'
                    }
                }
            )
        ).disposer(client => client.destroy())
    })
}

export default fp(dependecyInjection)
