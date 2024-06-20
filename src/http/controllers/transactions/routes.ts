import { FastifyInstance } from "fastify"
import { create } from "./create"

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', history)

  app.post('/transactions', create)
}