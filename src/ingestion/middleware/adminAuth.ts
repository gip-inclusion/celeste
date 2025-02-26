import { FastifyRequest, FastifyReply } from 'fastify';
import settings from '../../settings';

export async function verifyAdminApiToken(request: FastifyRequest, reply: FastifyReply) {
  const apiToken = request.headers['x-api-token'];
  const adminApiToken = settings.api.adminToken;

  if (!apiToken || typeof apiToken !== 'string') {
    return reply.status(401).send({ error: 'Missing or invalid API token' });
  }

  if (!adminApiToken || apiToken !== adminApiToken) {
    return reply.status(403).send({ error: 'Forbidden: Invalid admin API token' });
  }
}
