import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { verifyAdminApiToken } from '../../middleware/adminAuth';
import prisma from '../../database';

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
  fastify.addHook('preHandler', verifyAdminApiToken);

  fastify.get(
    '/',
    {
      schema: {
        description: 'List all clients',
        tags: ['Clients'],
        summary: 'List all events',
        security: [{ apiKey: [] }],
      },
    },
    async (request, reply) => {
      const clients = await prisma.client.findMany();
      return reply.send(clients);
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        description: 'Declare a new client',
        tags: ['Clients'],
        summary: 'Declare a new client',
        security: [{ apiKey: [] }],
      },
    },
    async (request, reply) => {
      const { name, source } = request.body as { name: string; source: string };

      if (!name || !source) {
        return reply.status(400).send({ error: 'Missing required fields: name, source' });
      }

      try {
        const apiToken = crypto.randomBytes(32).toString('hex');

        const client = await prisma.client.create({
          data: { name, source, apiToken },
        });

        return reply.status(201).send(client);
      } catch (error) {
        request.log.error('Error creating client:', error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    },
  );

  done();
}
