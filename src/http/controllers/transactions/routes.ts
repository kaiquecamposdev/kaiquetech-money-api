import { FastifyInstance } from "fastify"
import { create } from "./create"
import { fetchTransactionsHistory } from "./fetch-transactions-history"
import { remove } from "./remove"
import { update } from "./update"

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', fetchTransactionsHistory)

  app.post('/transactions', create)
  app.put('/transactions/:id', update)
  app.delete('/transactions/:id', remove)
}