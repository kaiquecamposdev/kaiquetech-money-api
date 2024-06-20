import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";

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

    return { transactions }
  }
}