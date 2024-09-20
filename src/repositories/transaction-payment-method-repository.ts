import { Prisma, TransactionPaymentMethod } from '@prisma/client';

export interface TransactionsPaymentMethodRepository {
  create(data: Prisma.TransactionPaymentMethodUncheckedCreateInput): Promise<TransactionPaymentMethod>
}