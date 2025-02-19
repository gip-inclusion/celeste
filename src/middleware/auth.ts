import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../database";
import { Client } from "@prisma/client";

export interface AuthenticatedRequest extends FastifyRequest {
    client: Client;
}

export async function verifyApiToken(request: FastifyRequest, reply: FastifyReply) {
    const apiToken = request.headers["x-api-token"];

    if (!apiToken || typeof apiToken !== "string") {
        return reply.status(401).send({ error: "Missing or invalid API token" });
    }

    const client = await prisma.client.findUnique({
        where: { apiToken },
    });

    if (!client) {
        return reply.status(401).send({ error: "Unauthorized: Invalid API token" });
    }

    (request as AuthenticatedRequest).client = client;
}