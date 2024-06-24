import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { CreateTransactionUseCase } from "@/usecases/create-transaction"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
    category: z.string().min(3).max(255),
    subCategory: z.string().min(3).max(255),
    price: z.number().min(0),
    discount: z.number().min(0),
    tax: z.number().min(0),
    paymentMethod: z.enum(['Money', 'Credit', 'Debit', 'Pix']),
  })

  const { name, description, category, subCategory, price, discount, tax, paymentMethod } = createBodySchema.parse(req.query)

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new CreateTransactionUseCase(transactionsRepository)

  await transactionUseCase.execute({
    name,
    description,
    category,
    subCategory,
    price,
    discount,
    tax,
    paymentMethod,
  })

  return res.status(201).send()
}