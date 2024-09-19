import { TransactionsRepository } from "@/repositories/transactions-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface SummaryUseCaseResponse {
  summary: {
    income: number
    outcome: number
    discount: number
    tax: number
  }
}

export class SummaryUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(): Promise<SummaryUseCaseResponse> {
    const summary = await this.transactionsRepository.getSummary();

    if (!summary) {
      throw new ResourceNotFoundError()
    }

    return { summary }
  }
}