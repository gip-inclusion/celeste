import fastify from './server';
import prisma from './database';
import settings from './settings';

async function main() {
    try {
        return fastify.listen({ port: settings.server.port, host: settings.server.host });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main()
    .then((address) => {
        console.log(`🚀 Serveur démarré sur ${address} [environment=${settings.environment}]`);
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })