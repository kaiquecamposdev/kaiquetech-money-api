import { prisma } from '@/lib/prisma'
import { Prisma, Transaction } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {

  async findById(id: string) {
    const transaction = await prisma.transaction.findUniqueOrThrow({
      where: {
        id
      }
    })

    return transaction
  }

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
    const amountToTransactionType = await prisma.$queryRaw`
      SELECT 
        type,
        CAST(COUNT(*) AS INT) AS count,
        CAST(SUM(amount) AS DECIMAL(10,2)) AS amount, 
        MAX(date) AS last_date
      FROM 
        transactions
      GROUP BY
        type
      ORDER BY
        type
    ` as { type: string, count: number, amount: number, last_date: Date }[]
    
    const amountToPaymentMethod = await prisma.$queryRaw`
      SELECT
        payment_method,
        CAST(COUNT(*) AS INT) AS count,
        CAST(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS DECIMAL(10,2)) AS amount
      FROM
        transactions
      GROUP BY
        payment_method
      ORDER BY
        payment_method
    ` as { payment_method: string, count: number, amount: number }[]

    const amountToMonth = await prisma.$queryRaw`
      SELECT
        to_char(date, 'YYYY-MM') AS year_month,
        CAST(COUNT(*) AS INT) AS count,
        CAST(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS DECIMAL(10,2)) AS incomes,
        CAST(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS DECIMAL(10,2)) AS expenses,
        CAST(SUM(amount) AS DECIMAL(10, 2)) AS amount
      FROM
        transactions
      GROUP BY
        year_month
      ORDER BY
        year_month
    ` as { year_month: string, count: number, incomes: number, expenses: number, amount: number }[]

    return {
      amountToTransactionType,
      amountToPaymentMethod,
      amountToMonth
    }
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction: Transaction = {
      id: randomUUID(),
      client_name: data.client_name || '',
      description: data.description,
      category: data.category || '',
      sub_category: data.sub_category || '',
      type: data.type,
      price: data.price,
      discount: data.discount || 0,
      tax: data.tax || 0,
      payment_method: data.payment_method,
      amount: data.price - (data.discount || 0) - (data.tax || 0),
      date: data.date ? new Date(data.date) : new Date(),
      created_at: new Date(),
      updated_at: null,
    }

    await prisma.transaction.create({ data: transaction })
  
    return transaction
  }

  async update(id: string, data: Prisma.TransactionUncheckedUpdateInput) {
    const transaction = await prisma.transaction.update({
      where: {
        id
      },
      data: {
        client_name: data.client_name,
        description: data.description,
        category: data.category,
        sub_category: data.sub_category,
        type: data.type,
        price: data.price,
        discount: data.discount,
        tax: data.tax,
        payment_method: data.payment_method,
        date: data.date,
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