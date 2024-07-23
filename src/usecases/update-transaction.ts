import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateTransactionUseCaseRequest {
  id: string;
  client?: string;
  description: string;
  category?: string;
  subCategory?: string;
  price: number;
  discount?: number;
  tax?: number;
  paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix';
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
    subCategory,
    price, 
    discount, 
    tax,
    paymentMethod, 
  }: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
    const oldTransaction = await this.transactionsRepository.findById(id)

    if(!oldTransaction) {
      throw new ResourceNotFoundError()
    }

    const newTransaction = await this.transactionsRepository.update(id, {
      date: date || oldTransaction.date,
      client: client || oldTransaction.client, 
      description: description || oldTransaction.description, 
      category: category || oldTransaction.category,
      subCategory: subCategory || oldTransaction.subCategory,
      price: price || oldTransaction.price, 
      discount: discount || oldTransaction.discount, 
      tax: tax || oldTransaction.tax,
      paymentMethod: paymentMethod || oldTransaction.paymentMethod,
    });

    return { 
      transaction: newTransaction
    }
  }

}