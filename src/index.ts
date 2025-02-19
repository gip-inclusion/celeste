import server from './server';
import prisma from './database';

async function main() {
    try {
        await server.listen({ port: 3000, host: "0.0.0.0" });
        console.log("🚀 Serveur démarré sur http://localhost:3000");
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