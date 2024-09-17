import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { CreateTransactionUseCase } from "@/usecases/create-transaction"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createBodySchema = z.object({
    client: z.string().optional(),
    description: z.string().max(255),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    price: z.coerce.number().default(0),
    discount: z.coerce.number().optional().default(0),
    tax: z.coerce.number().optional().default(0),
    paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Link de Pagamento', 'TED']),
    date: z.coerce.date(),
  })

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new CreateTransactionUseCase(transactionsRepository)

  const { 
    client, 
    description, 
    category, 
    subCategory, 
    price,
    discount, 
    tax,  
    paymentMethod,
    date,
  } = createBodySchema.parse(req.body)

  const { transaction } = await transactionUseCase.execute({
    client, 
    description, 
    category, 
    subCategory, 
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