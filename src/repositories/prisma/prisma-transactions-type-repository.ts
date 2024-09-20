import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { TransactionsTypeRepository } from '../transactions-type-repository'

export class PrismaTransactionsTypeRepository implements TransactionsTypeRepository {
  async create(data: Prisma.TransactionTypeUncheckedCreateInput) {
    const transactionType = await prisma.transactionType.create({
      data: {
        id: randomUUID(),
        name: data.name,
        amount: data.amount,
      },
    })

    return transactionType
  }
}