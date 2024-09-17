import { TransactionsRepository } from "@/repositories/transactions-repository";
import { z } from "zod";

const saveTransactionsSchema = z.object({
  client: z.string().optional(),
  description: z.string().max(255),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  price: z.coerce.number().default(0),
  discount: z.coerce.number().optional().default(0),
  tax: z.coerce.number().optional().default(0),
  paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Link de Pagamento', 'TED']),
  date: z.coerce.date()
})

type SaveTransactionsSchemaType = z.infer<typeof saveTransactionsSchema>

interface SaveTransactionsUseCaseRequest {
  unregisteredTransactions: SaveTransactionsSchemaType[]
}

export class SaveTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ unregisteredTransactions }: SaveTransactionsUseCaseRequest) {
    const transactionPromises = unregisteredTransactions.map(
      (unregisteredTransaction) => {
        return this.transactionsRepository.create({
          client: unregisteredTransaction.client,
          description: unregisteredTransaction.description,
          category: unregisteredTransaction.category,
          subCategory: unregisteredTransaction.subCategory,
          price: unregisteredTransaction.price,
          discount: unregisteredTransaction.discount,
          tax: unregisteredTransaction.tax,
          paymentMethod: unregisteredTransaction.paymentMethod,
          date: unregisteredTransaction.date,
        });
      }
    );

    const transactions = await Promise.all(transactionPromises); 

    return { transactions }
  }
}