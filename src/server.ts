import Fastify from "fastify";
import { registerApiRoutes } from "./api";
import { registerSwagger } from "./swagger";
import prisma from "./database";
import { register } from "module";

const fastify = Fastify({ logger: true });

registerSwagger(fastify);

registerApiRoutes(fastify);

fastify.addHook("onClose", async () => {
    console.log("🔌 Fermeture de Prisma...");
    await prisma.$disconnect();
  });

export async function startServer() {
    try {
      // 📌 Attendre que toutes les routes et plugins soient prêts
      await fastify.ready();
  
      // 📌 Générer la documentation Swagger
      fastify.swagger();
  
      console.log("🚀 Serveur prêt, Swagger généré !");
    } catch (err) {
      console.error("❌ Erreur au démarrage du serveur :", err);
      process.exit(1);
    }
  }

export default fastify;