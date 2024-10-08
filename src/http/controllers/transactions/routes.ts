import { FastifyInstance } from "fastify"
import { create } from "./create"
import { fetchTransactions } from "./fetch-transactions"
import { process } from "./process"
import { remove } from "./remove"
import { save } from "./save"
import { summary } from "./summary"
import { update } from "./update"
import { upload } from "./upload"

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', fetchTransactions)

  app.get('/transactions/summary', summary)

  app.post('/transactions', create)
  
  app.put('/transactions/:id', update)

  app.delete('/transactions/:id', remove)

  app.post('/upload', upload)

  app.post('/process', process)
  
  app.post('/save', save)
}