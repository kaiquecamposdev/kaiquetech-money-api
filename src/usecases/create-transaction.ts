import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";

interface CreateTransactionUseCaseRequest {
  name: string;
  description: string | null;
  category: string | null;
  subCategory: string | null;
  price: number;
  discount: number | null;
  tax: number | null;
  paymentMethod: string;
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ 
    name, 
    description, 
    category,
    subCategory,
    price, 
    discount, 
    tax,
    paymentMethod, 
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = await this.transactionsRepository.create({ 
      name, 
      description, 
      category,
      subCategory,
      price, 
      discount, 
      tax,
      paymentMethod, 
    });

    return { transaction }
  }

}