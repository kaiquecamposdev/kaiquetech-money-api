import { PaymentMethod, Prisma, Transaction, Type } from '@prisma/client';

type Summary = {
  amountToTransactionType: (Prisma.PickEnumerable<Prisma.TransactionTypeGroupByOutputType, ("name" | "amount")[]> & {
    _sum: {
        amount: number | null;
    };
})[],
  amountToPaymentMethod: (Prisma.PickEnumerable<Prisma.TransactionPaymentMethodGroupByOutputType, ("amount" | "name")[]> & {
    _sum: {
        amount: number | null;
    };
})[],
  amountToMonth: {
    year_month: string
    amount: number
  }[]
}

export interface TransactionsRepository {
  findMany(offset: number, limit: number): Promise<{maxSize: number, transactions: Transaction[]}>
  getSummary(): Promise<Summary>
  create(data: Prisma.TransactionUncheckedCreateInput & {
    paymentMethod: PaymentMethod
    type: Type
  }): Promise<Transaction>
  update(id: string, transaction: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  delete(id: string): Promise<Transaction>
}