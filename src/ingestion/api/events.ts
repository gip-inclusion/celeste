import { FastifyInstance } from 'fastify';
import prisma from '../../database';
import { AuthenticatedRequest, verifyApiToken } from '../middleware/auth';

const ALLOWED_ACTOR_TYPES = ['admin', 'beneficiary', 'purchaser', 'employee', 'prescriber'];

export default function (fastify: FastifyInstance, opts: unknown, done: () => void) {
  fastify.addHook('preHandler', verifyApiToken);

  fastify.get(
    '/',
    {
      schema: {
        description: 'List all events',
        tags: ['Events'],
        summary: 'List all events',
        security: [{ apiKey: [] }],
      },
    },
    async (_, reply) => {
      const events = await prisma.event.findMany();
      return reply.send(events);
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        description: 'Publish an event',
        tags: ['Events'],
        summary: 'Publish an event',
        security: [{ apiKey: [] }],
        body: {
          type: 'object',
          required: ['event_type', 'event_timestamp', 'actor_sub', 'actor_type'],
          properties: {
            event_id: { type: 'string', format: 'uuid' },
            event_type: { type: 'string' },
            event_timestamp: { type: 'string', format: 'date-time' },
            event_correlation_id: { type: 'string' },
            actor_sub: { type: 'string' },
            actor_type: { type: 'string', enum: ALLOWED_ACTOR_TYPES },
            beneficiary_sub: { type: 'string' },
            admin_sub: { type: 'string' },
            structure_sub: { type: 'string' },
            payload: { type: 'object' },
          },
        },
        examples: [
          {
            event_type: 'if.application.submitted',
            event_timestamp: '2025-02-27T18:58:22.916Z',
            actor_sub: 'jean-michel.conseiller@example.com',
            actor_type: 'prescrisber',
            beneficiary_sub: 'benedicte.ficiaire@example.net',
            structure_sub: '55327987900672',
            payload: {},
          },
        ],
      },
    },
    async (request, reply) => {
      try {
        const requestBody = request.body as {
          event_id?: string;
          event_type: string;
          event_timestamp: string;
          event_correlation_id?: string;
          actor_sub: string;
          actor_type: string;
          beneficiary_sub?: string;
          structure_sub?: string;
          payload: never;
        };

        const client = (request as AuthenticatedRequest).client;

        const finalEventId = requestBody.event_id || crypto.randomUUID();

        if (requestBody.event_id) {
          const existingEvent = await prisma.event.findUnique({
            where: { id: requestBody.event_id },
          });
          if (existingEvent) {
            return reply.status(409).send({
              error: `Event with ID ${requestBody.event_id} already exists`,
            });
          }
        }

        const event = await prisma.event.create({
          data: {
            id: finalEventId,
            type: requestBody.event_type,
            source: client.source,
            timestamp: new Date(requestBody.event_timestamp),
            correlationId: requestBody.event_correlation_id,
            actorSub: requestBody.actor_sub,
            actorType: requestBody.actor_type,
            beneficiarySub: requestBody.beneficiary_sub,
            structureSub: requestBody.structure_sub,
            payload: requestBody.payload,
            clientId: client.id,
          },
        });

        return reply.status(201).send({ message: 'Event created', event });
      } catch (error) {
        request.log.error('Error inserting event:', error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    },
  );

  done();
}
