import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { env } from './env';
import { transactionsRoutes } from "./http/controllers/transactions/routes";

export const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})
app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})
app.register(transactionsRoutes)

app.setErrorHandler((error: ZodError, _req: FastifyRequest, res: FastifyReply) => {
  console.log(error)
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