import { prisma } from '@/lib/prisma'
import { Prisma, Transaction } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { TransactionsRepository } from '../transactions-repository'

type TransactionCreateWithPaymentMethodAndType = {
  data: Prisma.TransactionUncheckedCreateInput & Prisma.TransactionTypeUncheckedCreateWithoutTransactionInput
}

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

  async findMany(offset: number, limit: number) {
    const maxSize = await prisma.transaction.count()

    const transactions = await prisma.transaction.findMany({
      skip: limit,
      take: offset,
    })

    return {
      maxSize,
      transactions
    }
  }

  async getSummary() {
    const summary = await prisma.transaction.groupBy({
      by: ['type', 'price', 'discount', 'tax'],
      _sum: {
        price: true,
        discount: true,
        tax: true
      }
    })

    return summary
  }

  async create({ data }: TransactionCreateWithPaymentMethodAndType) {
    
    const transaction: Transaction = {
      id: randomUUID(),
      client_name: data.client_name || '',
      description: data.description,
      category: data.category || '',
      subCategory: data.subCategory || '',
      type: data.type,
      price: data.price,
      discount: data.discount || 0,
      tax: data.tax || 0,
      paymentMethod: data.paymentMethod,
      date: data.date ? new Date(data.date) : new Date(),
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
      data: {
        client: transaction.client,
        description: transaction.description,
        category: transaction.category,
        subCategory: transaction.subCategory,
        price: transaction.price,
        discount: transaction.discount,
        tax: transaction.tax,
        paymentMethod: transaction.paymentMethod,
        date: transaction.date,
        updated_at: new Date(),
      }
    })

    return transaction
  }

  async delete(id: string) {
    const transactionDeleted = await prisma.transaction.delete({
      where: {
        id
      }
    })

    return transactionDeleted
  }
}