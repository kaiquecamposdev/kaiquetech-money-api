import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { FetchTransactionsHistoryUseCase } from "@/usecases/fetch-transactions-history"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function fetchTransactionsHistory(req: FastifyRequest, res: FastifyReply) {
  const createParamsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = createParamsSchema.parse(req.query)

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new FetchTransactionsHistoryUseCase(transactionsRepository)

  const { transactions } = await transactionUseCase.execute({ page })

  return res.status(200).send({
    transactions
  })
}