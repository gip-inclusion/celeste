import Fastify from "fastify";
import apiRoutes from "./api";

const fastify = Fastify({ logger: true });

fastify.register(apiRoutes, { prefix: '/api' });

export default fastify;