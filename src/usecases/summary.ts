import { TransactionsRepository } from "@/repositories/transactions-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface SummaryUseCaseResponse {
  summary: {
    amountToTransactionType: {
      type: string, 
      count: number,
      amount: number, 
      last_date: Date 
    }[],
    amountToPaymentMethod: {
      payment_method: string,
      count: number,
      amount: number
    }[],
    amountToMonth: {
      year_month: string,
      count: number,
      incomes: number,
      expenses: number,
      amount: number
    }[]}
}

export class SummaryUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute(): Promise<SummaryUseCaseResponse> {
    const summary = await this.transactionsRepository.getSummary();

    if (!summary) {
      throw new ResourceNotFoundError()
    }

    return { 
      summary
    }
  }
}