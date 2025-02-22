import { FastifyInstance } from "fastify";
import eventRoutes from "./events";
import adminClientRoutes from "./admin/clients";


export async function registerApiRoutes(fastify: FastifyInstance) {
    fastify.decorateRequest("client", null);

    fastify.get("/", async () => {
        return { message: "Celeste API is running 🚀" };
    });

    await fastify.register(eventRoutes, { prefix: "/api/events" });
    await fastify.register(adminClientRoutes, { prefix: "/api/admin/clients" });
}
