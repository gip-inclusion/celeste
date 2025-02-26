import fastify, { startServer } from './server';
import settings from '../settings';

async function main() {
  try {
    await startServer();
    const address = await fastify.listen({
      port: settings.server.port,
      host: settings.server.host,
    });
    fastify.log.info(`🚀 Serveur démarré sur ${address} [environment=${settings.environment}]`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
