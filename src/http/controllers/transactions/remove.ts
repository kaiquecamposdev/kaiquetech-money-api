import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { DeleteTransactionUseCase } from '@/usecases/delete-transaction'
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function remove(req: FastifyRequest, res: FastifyReply) {
  const removeParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = removeParamsSchema.parse(req.params)

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new DeleteTransactionUseCase(transactionsRepository)

  const { transactionDeleted } = await transactionUseCase.execute({
    id,
  })

  return res.status(204).send({
    transactionDeleted
  })
}