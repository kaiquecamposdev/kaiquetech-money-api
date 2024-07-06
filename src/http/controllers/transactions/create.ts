import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { CreateTransactionUseCase } from "@/usecases/create-transaction"
import { InvalidCsvFormatError } from "@/usecases/errors/invalid-csv-format-error"
import { Transaction } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createBodySchema = z.object({
    date: z.date().default(new Date()),
    name: z.string().max(255),
    description: z.string().max(255).nullable(),
    category: z.string().max(255).nullable(),
    subCategory: z.string().max(255).nullable(),
    price: z.coerce.number().min(1).default(0),
    discount: z.coerce.number().min(1).default(0).nullable(),
    tax: z.coerce.number().min(1).default(0).nullable(),
    paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix']),
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
        date,
        name, 
        description, 
        category, 
        subCategory, 
        paymentMethod,
        discount, 
        tax,  
        price,
      } = createBodySchema.parse(transaction)

      await transactionUseCase.execute({
        date,
        name,
        description,
        category,
        subCategory,
        paymentMethod,
        discount,
        tax,
        price,
      })
    })

    Promise.all(transactionsPromises)

    return res.status(201).send({ 
      message: 'Transactions created successfully.'
    })
  } else {
    const { 
      date,
      name, 
      description, 
      category, 
      subCategory, 
      paymentMethod,
      discount, 
      tax,  
      price,
    } = createBodySchema.parse(req.body)

    await transactionUseCase.execute({
      date,
      name,
      description,
      category,
      subCategory,
      paymentMethod,
      discount,
      tax,
      price,
    })

    return res.status(201).send({
      message: 'Transaction created successfully.'
    })
  }
}