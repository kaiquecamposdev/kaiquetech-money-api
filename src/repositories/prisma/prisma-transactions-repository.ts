import { prisma } from '@/lib/prisma'
import { Prisma, Transaction } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {

  async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id
      }
    })

    if (!transaction) {
      return null
    }

    return transaction
  }

  async findMany(page: number) {
    const transactions = await prisma.transaction.findMany({
      skip: (page - 1) * 20,
      take: 20,
    })

    return transactions
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction: Transaction = {
      id: randomUUID(),
      name: data.name,
      price: data.price,
      discount: data.discount || 0,
      tax: data.tax || 0,
      total: data.price - (data.discount || 0) + (data.tax || 0),
      description: data.description || '',
      category: data.category || '',
      paymentMethod: data.paymentMethod || '',
      created_at: new Date(),
      updated_at: null,
    }
  
    await prisma.transaction.create({ data: transaction })
  
    return transaction
  }

  async update(id: string, transaction: Transaction) {
    await prisma.transaction.update({
      where: {
        id
      },
      data: transaction
    })

    return transaction
  }

  async delete(id: string) {
    await prisma.transaction.delete({
      where: {
        id
      }
    })
  }
}