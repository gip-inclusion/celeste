import Fastify from 'fastify';
import { registerApiRoutes } from './api';
import { registerSwagger } from './swagger';
import prisma from './database';
import logger from './logger';

const fastify = Fastify({ logger });

registerSwagger(fastify);

registerApiRoutes(fastify);

fastify.addHook('onClose', async () => {
  fastify.log.info('🔌 Fermeture de Prisma...');
  await prisma.$disconnect();
});

export async function startServer() {
  try {
    // 📌 Attendre que toutes les routes et plugins soient prêts
    await fastify.ready();

    // 📌 Générer la documentation Swagger
    fastify.swagger();

    fastify.log.info('🚀 Serveur prêt, Swagger généré !');
  } catch (err) {
    fastify.log.error('❌ Erreur au démarrage du serveur :', err);
    process.exit(1);
  }
}

export default fastify;
