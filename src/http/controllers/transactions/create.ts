import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { CreateTransactionUseCase } from "@/usecases/create-transaction"
import { InvalidCsvFormatError } from "@/usecases/errors/invalid-csv-format-error"
import { Transaction } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createBodySchema = z.object({
    client: z.string().optional(),
    description: z.string().max(255),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    price: z.coerce.number().min(1).default(0),
    discount: z.coerce.number().optional().default(0),
    tax: z.coerce.number().optional().default(0),
    paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix']),
    date: z.date().default(new Date()),
  })

  const transactionsRepository = new PrismaTransactionsRepository()
  const transactionUseCase = new CreateTransactionUseCase(transactionsRepository)

  if(req.body instanceof Array) {
    const transactions = req.body as Transaction[]

    if(!transactions) {
      throw new InvalidCsvFormatError()
    }
    
    const transactionsPromises = transactions.map(async (transaction) => {
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
      } = createBodySchema.parse(transaction)

      await transactionUseCase.execute({
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
    })

    Promise.all(transactionsPromises)

    return res.status(201).send({ 
      message: 'Transactions created successfully.'
    })
  } else {
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

    await transactionUseCase.execute({
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
      message: 'Transaction created successfully.'
    })
  }
}