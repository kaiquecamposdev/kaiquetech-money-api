import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateTransactionUseCaseRequest {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  subCategory: string | null;
  price: number;
  discount: number | null;
  tax: number | null;
  paymentMethod: string;
  date: Date | null
}

interface UpdateTransactionUseCaseResponse {
  transaction: Transaction
}

export class UpdateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    id, 
    date,
    name, 
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
      name: name || oldTransaction.name, 
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