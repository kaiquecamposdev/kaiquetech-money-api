import { TransactionsRepository } from "@/repositories/transactions-repository";
import { z } from "zod";

const saveTransactionsSchema = z.object({
  client_name: z.string().optional(),
  description: z.string().max(255),
  category: z.string().optional(),
  sub_category: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  price: z.coerce.number().default(0),
  discount: z.coerce.number().optional().default(0),
  tax: z.coerce.number().optional().default(0),
  payment_method: z.enum(['CREDIT', 'DEBIT', 'MONEY', 'PIX', 'PAYMENTLINK', 'TED']),
  date: z.coerce.date(),
})

type SaveTransactionsSchemaType = z.infer<typeof saveTransactionsSchema>

interface SaveTransactionsUseCaseRequest {
  unregisteredTransactions: SaveTransactionsSchemaType[]
}

export class SaveTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ unregisteredTransactions }: SaveTransactionsUseCaseRequest) {
    const transactionPromises = unregisteredTransactions.map(
      async (unregisteredTransaction) => {
        return await this.transactionsRepository.create({
          client_name: unregisteredTransaction.client_name,
          description: unregisteredTransaction.description,
          category: unregisteredTransaction.category,
          sub_category: unregisteredTransaction.sub_category,
          type: unregisteredTransaction.type,
          price: unregisteredTransaction.price,
          discount: unregisteredTransaction.discount,
          tax: unregisteredTransaction.tax,
          payment_method: unregisteredTransaction.payment_method,
          date: unregisteredTransaction.date,
        });
      }
    );

    const transactions = await Promise.all(transactionPromises); 

    return { transactions }
  }
}