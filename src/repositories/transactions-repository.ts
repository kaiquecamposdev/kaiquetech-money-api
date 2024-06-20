import { Prisma, Transaction } from '@prisma/client'

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction | null>
  findMany(page: number): Promise<Transaction[]>
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  update(id: string, transaction: Transaction): Promise<Transaction>
  delete(id: string): Promise<void>
}