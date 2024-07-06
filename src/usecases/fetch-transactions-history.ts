import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchTransactionsHistoryUseCaseRequest {
  page: number
}
interface FetchTransactionsHistoryUseCaseResponse {
  transactions: Transaction[]
}

export class FetchTransactionsHistoryUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ 
    page 
  }: FetchTransactionsHistoryUseCaseRequest): Promise<FetchTransactionsHistoryUseCaseResponse> {
    const transactions = await this.transactionsRepository.findMany(page);

    if (!transactions) {
      throw new ResourceNotFoundError()
    }

    return { transactions }
  }
}