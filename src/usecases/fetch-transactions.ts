import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchTransactionsUseCaseRequest {
  offset: number
  limit: number
}
interface FetchTransactionsUseCaseResponse {
  maxSize: number
  transactions: Transaction[]
}

export class FetchTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ 
    offset,
    limit 
  }: FetchTransactionsUseCaseRequest): Promise<FetchTransactionsUseCaseResponse> {
    const { maxSize, transactions } = await this.transactionsRepository.findMany(offset, limit);

    if (!transactions) {
      throw new ResourceNotFoundError()
    }

    return { maxSize, transactions }
  }
}