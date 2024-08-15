import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteTransactionUseCaseRequest {
  id: string;
}

interface DeleteTransactionUseCaseResponse {
  transactionDeleted: Transaction;
}

export class DeleteTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    id, 
  }: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
    const transactionDeleted = await this.transactionsRepository.delete(id);

    if(!transactionDeleted) {
      throw new ResourceNotFoundError();
    }

    return {
      transactionDeleted
    }
  }
}