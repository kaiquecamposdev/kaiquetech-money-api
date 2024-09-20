import { PrismaTransactionsPaymentMethodRepository } from "@/repositories/prisma/prisma-transactions-payment-method-repository"
import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { PrismaTransactionsTypeRepository } from "@/repositories/prisma/prisma-transactions-type-repository"
import { CreateTransactionUseCase } from "@/usecases/create-transaction"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createBodySchema = z.object({
    client_name: z.string().optional(),
    description: z.string().max(255),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE']),
    price: z.coerce.number().default(0),
    discount: z.coerce.number().optional().default(0),
    tax: z.coerce.number().optional().default(0),
    paymentMethod: z.enum(['CREDIT', 'DEBIT', 'MONEY', 'PIX', 'PAYMENTLINK', 'TED']),
    date: z.coerce.date(),
  })

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionTypeRepository = new PrismaTransactionsTypeRepository()
  const transactionsPaymentMethodRepository = new PrismaTransactionsPaymentMethodRepository()
  const transactionUseCase = new CreateTransactionUseCase(transactionsRepository, transactionTypeRepository, transactionsPaymentMethodRepository)

  const { 
    client_name, 
    description, 
    category, 
    subCategory,
    type, 
    price,
    discount, 
    tax,  
    paymentMethod,
    date,
  } = createBodySchema.parse(req.body)

  const { transaction } = await transactionUseCase.execute({
    client_name, 
    description, 
    category, 
    subCategory, 
    type,
    price,
    discount, 
    tax,  
    paymentMethod,
    date,
  })

  return res.status(201).send({
    transaction,
  })
}