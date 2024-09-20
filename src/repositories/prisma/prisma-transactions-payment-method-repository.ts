import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { TransactionsPaymentMethodRepository } from '../transaction-payment-method-repository'

export class PrismaTransactionsPaymentMethodRepository implements TransactionsPaymentMethodRepository {
  async create(data: Prisma.TransactionPaymentMethodUncheckedCreateInput) {
    const transactionPaymentMethod = await prisma.transactionPaymentMethod.create({
      data: {
        id: randomUUID(),
        name: data.name,
        amount: data.amount,
      },
    })

    return transactionPaymentMethod
  }

}