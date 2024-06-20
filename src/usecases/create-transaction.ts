import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";

interface CreateTransactionUseCaseRequest {
  name: string;
  price: number;
  discount: number | null;
  tax: number | null;
  paymentMethod: string;
  description: string | null;
  category: string | null;
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(data: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = await this.transactionsRepository.create(data);

    return transaction
  }

}