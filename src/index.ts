import server from './server';
import prisma from './database';

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function main() {
    try {
        await server.listen({ port: PORT, host: HOST });
        console.log(`🚀 Serveur démarré sur http://${HOST}:${PORT} [environment=${NODE_ENV}]`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })