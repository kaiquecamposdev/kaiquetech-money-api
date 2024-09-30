import { Prisma, Transaction } from '@prisma/client';

type FindManyResponseType = {
  maxSize: number
  transactions: Transaction[]
}

type SummaryResponseType = {
  amountToTransactionType: { 
    type: string, 
    amount: number, 
    last_date: Date 
  }[],
  amountToPaymentMethod: {
    payment_method: string,
    count: number,
    amount: number;
  }[],
  amountToMonth: {
    year_month: string
    count: number
    incomes: number
    expenses: number
    amount: number
  }[]
}

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction>
  findMany(offset: number, limit: number): Promise<FindManyResponseType>
  getSummary(): Promise<SummaryResponseType>
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  update(id: string, data: Prisma.TransactionUncheckedUpdateInput): Promise<Transaction>
  delete(id: string): Promise<Transaction>
}