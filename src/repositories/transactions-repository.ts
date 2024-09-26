import { Prisma, Transaction } from '@prisma/client';

type Summary = {
  amountToTransactionType: {
    type: string
    amount: number
  }[],
  amountToPaymentMethod: {
    payment_method: string
    amount: number
  }[],
  amountToMonth: {
    year_month: string
    amount: number
  }[]
}

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction>
  findMany(offset: number, limit: number): Promise<{maxSize: number, transactions: Transaction[]}>
  getSummary(): Promise<Summary>
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  update(id: string, data: Prisma.TransactionUncheckedUpdateInput): Promise<Transaction>
  delete(id: string): Promise<Transaction>
}