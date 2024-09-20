import { prisma } from '@/lib/prisma'
import { PaymentMethod, Prisma, Transaction, Type } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {

  async findMany(offset: number, limit: number) {
    const maxSize = await prisma.transaction.count()

    const transactions = await prisma.transaction.findMany({
      skip: offset,
      take: limit,
    })

    return {
      maxSize,
      transactions
    }
  }

  async getSummary() {
    const amountToTransactionType = await prisma.transactionType.groupBy({
      by: ['name', 'amount'],
      orderBy: {
        amount: 'desc'
      }
    }) 
    
    const amountToPaymentMethod = await prisma.transactionPaymentMethod.groupBy({
      by: ['name', 'amount'],
      orderBy: {
        amount: 'desc'
      }
    })

    const amountToMonth = await prisma.$queryRaw`
      SELECT
        to_char(date, 'YYYY-MM') AS year_month,
        SUM(amount) AS amount
      FROM
        transactions
      GROUP BY
        year_month
      ORDER BY
        year_month
    ` as { year_month: string, amount: number }[]

    return {
      amountToTransactionType,
      amountToPaymentMethod,
      amountToMonth
    }
  }

  async create(data: Prisma.TransactionUncheckedCreateInput & {
    paymentMethod: PaymentMethod
    type: Type
  }) {
    const transaction: Transaction = {
      id: randomUUID(),
      client_name: data.client_name || '',
      description: data.description,
      category: data.category || '',
      subCategory: data.subCategory || '',
      typeId: data.typeId,
      price: data.price,
      discount: data.discount || 0,
      tax: data.tax || 0,
      amount: data.price - (data.discount || 0) - (data.tax || 0),
      paymentMethodId: data.paymentMethodId,
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