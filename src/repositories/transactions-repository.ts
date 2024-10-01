import { Prisma, Transaction } from '@prisma/client';

type FindManyResponseType = {
  maxSize: number
  transactions: Transaction[]
}

type SummaryResponseType = {
  summaryToTransactionType: { 
    type: string, 
    count: number, 
    discounts: number,
    taxes: number,
    amount: number, 
    last_date: Date 
  }[],
  summaryToPaymentMethod: {
    count: number,
    payment_method: string,
    discounts: number,
    taxes: number,
    incomes: number;
  }[],
  summaryToMonth: {
    year_month: string
    count: number
    discounts: number
    taxes: number
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