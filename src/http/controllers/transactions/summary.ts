import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { SummaryUseCase } from "@/usecases/summary"
import { FastifyReply, FastifyRequest } from "fastify"

export async function fetchTransactions(req: FastifyRequest, res: FastifyReply) {

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new SummaryUseCase(transactionsRepository)

  const { summary } = await transactionUseCase.execute()

  return res.status(200).send({
    summary
  })
}