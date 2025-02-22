import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export async function registerSwagger(fastify: FastifyInstance) {

    // 📌 Configuration de Swagger
    fastify.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Celeste API documentation',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0'
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server'
                },
                {
                    url: 'https://celeste-staging.osc-fr1.scalingo.io',
                    description: 'Demonstration server'
                }
            ],
            tags: [
                { name: 'Events', description: 'Event related endpoints' },
                { name: 'Clients', description: 'Administration related endpoints' }
            ],
            components: {
                securitySchemes: {
                    apiKey: {
                        type: 'apiKey',
                        name: 'x-api-key',
                        in: 'header'
                    }
                }
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here'
            }
        }

    });

    // 📌 Ajout de Swagger UI (interface utilisateur)
    fastify.register(swaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        },
        staticCSP: true,
        transformSpecification: (swaggerObject, request, reply) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
    });
}
