import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { env } from './env';
import { transactionsRoutes } from "./http/controllers/transactions/routes";
import { csvExtract } from './utils/csv-extract';

export const app = fastify({ logger: true })

app.register(fastifyCors, {
  origin: '*'
})
app.register(fastifyMultipart)
app.addContentTypeParser('text/csv', { parseAs: 'buffer' }, async (_req, body, done) => {
  const transactions = await csvExtract(body.toString())

  done(null, transactions);
});
app.register(transactionsRoutes)

app.setErrorHandler((error: ZodError, _req: FastifyRequest, res: FastifyReply) => {
  if (error instanceof ZodError) {
    res
      .status(400)
      .send({ message: 'Validation Error.', issues: error.format() })
  }

  if (env.NODE_ENV === 'production') {
    console.error(error)
  }

  return res.status(500).send({ message: 'Internal Server Error.' })
})