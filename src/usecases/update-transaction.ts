import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateTransactionUseCaseRequest {
  id: string;
  client?: string;
  description: string;
  category?: string;
  sub_category?: string;
  price: number;
  discount?: number;
  tax?: number;
  payment_method: 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Link de Pagamento' | 'TED';
  date: Date;
}

interface UpdateTransactionUseCaseResponse {
  transaction: Transaction
}

export class UpdateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    id, 
    date,
    client, 
    description, 
    category,
    sub_category,
    price, 
    discount, 
    tax,
    payment_method, 
  }: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
    const oldTransaction = await this.transactionsRepository.findById(id)

    if(!oldTransaction) {
      throw new ResourceNotFoundError()
    }

    const newTransaction = await this.transactionsRepository.update(id, {
      client: client || oldTransaction.client, 
      description: description || oldTransaction.description, 
      category: category || oldTransaction.category,
      sub_category: sub_category || oldTransaction.sub_category,
      price: price || oldTransaction.price, 
      discount: discount || oldTransaction.discount, 
      tax: tax || oldTransaction.tax,
      payment_method: payment_method || oldTransaction.payment_method,
      date: date || oldTransaction.date,
    });

    return { 
      transaction: newTransaction
    }
  }

}