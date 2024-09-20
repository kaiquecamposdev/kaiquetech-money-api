import { Prisma, TransactionType } from '@prisma/client';

export interface TransactionsTypeRepository {
  create(data: Prisma.TransactionTypeUncheckedCreateInput): Promise<TransactionType>
}