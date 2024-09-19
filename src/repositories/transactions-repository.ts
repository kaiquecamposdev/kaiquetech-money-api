import { Prisma, Transaction } from '@prisma/client';

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction | null>
  findMany(offset: number, limit: number): Promise<{maxSize: number, transactions: Transaction[]}>
  getSummary(): Promise<{ income: number, outcome: number, discount: number, tax: number  }>
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  update(id: string, transaction: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  delete(id: string): Promise<Transaction>
}