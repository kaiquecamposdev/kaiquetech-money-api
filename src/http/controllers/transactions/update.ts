import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { UpdateTransactionUseCase } from "@/usecases/update-transaction"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function update(req: FastifyRequest, res: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const updateBodySchema = z.object({
    client: z.string().optional(),
    description: z.string().max(255),
    category: z.string().optional(),
    sub_category: z.string().optional(),
    price: z.coerce.number().default(0),
    discount: z.coerce.number().optional().default(0),
    tax: z.coerce.number().optional().default(0),
    payment_method: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Link de Pagamento', 'TED']),
    date: z.coerce.date(),
  })

  const { id } = updateParamsSchema.parse(req.params)
  const { 
    client, 
    description, 
    category, 
    sub_category, 
    price, 
    discount, 
    tax, 
    payment_method, 
    date, 
  } = updateBodySchema.parse(req.body)

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new UpdateTransactionUseCase(transactionsRepository)

  const { transaction } = await transactionUseCase.execute({
    id,
    client,
    description,
    category,
    sub_category,
    price,
    discount,
    tax,
    payment_method,
    date,
  })

  return res.status(201).send({
    transaction
  })
}