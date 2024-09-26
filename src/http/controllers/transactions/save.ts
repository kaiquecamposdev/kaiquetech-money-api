import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository";
import { SaveTransactionsUseCase } from "@/usecases/save-transactions";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const saveBodySchema = z.object({
  unregisteredTransactions: z.array(
    z.object({
      client_name: z.string().optional(),
      description: z.string().max(255),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      type: z.enum(['INCOME', 'EXPENSE']),
      price: z.coerce.number().default(0),
      discount: z.coerce.number().optional().default(0),
      tax: z.coerce.number().optional().default(0),
      payment_method: z.enum(['CREDIT', 'DEBIT', 'MONEY', 'PIX', 'PAYMENTLINK', 'TED']),
      date: z.coerce.date(),
    })
  )
})

export async function save(req: FastifyRequest, res: FastifyReply) {
  const { unregisteredTransactions } = saveBodySchema.parse(req.body) 

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new SaveTransactionsUseCase(transactionsRepository)

  const { transactions } = await transactionUseCase.execute({
    unregisteredTransactions
  })

  return res.status(200).send({
    message: 'Transações criadas com sucesso!',
    isSuccess: true,
    transactions,
  }) 
}