import fastify, { startServer } from './server';
import prisma from './database';
import settings from './settings';

async function main() {
    try {
        await startServer();
        const address = await fastify.listen({ port: settings.server.port, host: settings.server.host });
        console.log(`🚀 Serveur démarré sur ${address} [environment=${settings.environment}]`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();