import { FastifyInstance } from "fastify"
import { create } from "./create"
import { fetchTransactionsHistory } from "./fetch-transactions-history"

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', fetchTransactionsHistory)

  app.post('/transactions', create)
}