import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import eventRoutes from "./events";
import adminClientRoutes from "./admin/clients";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {

    fastify.decorateRequest('client', null)

    fastify.get("/", async () => {
        return { message: "Celeste API is running 🚀" };
    });

    fastify.register(eventRoutes, { prefix: '/events' });

    fastify.register(adminClientRoutes, { prefix: '/admin/clients' });

    done();
}
