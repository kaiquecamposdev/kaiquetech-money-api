import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { FetchTransactionsUseCase } from "@/usecases/fetch-transactions"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function fetchTransactions(req: FastifyRequest, res: FastifyReply) {
  const createParamsSchema = z.object({
    offset: z.coerce.number().min(1).default(10),
    limit: z.coerce.number().min(1).default(10)
  })

  const { offset, limit } = createParamsSchema.parse(req.query)

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new FetchTransactionsUseCase(transactionsRepository)

  const { maxSize, transactions } = await transactionUseCase.execute({ 
    offset,
    limit
  })

  return res.status(200).send({
    maxSize,
    transactions
  })
}