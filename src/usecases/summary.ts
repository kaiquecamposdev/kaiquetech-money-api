import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Prisma } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface SummaryUseCaseResponse {
  summary: {
    amountToTransactionType: (Prisma.PickEnumerable<Prisma.TransactionTypeGroupByOutputType, ("name" | "amount")[]> & {
      _sum: {
          amount: number | null;
      };
  })[],
    amountToPaymentMethod: (Prisma.PickEnumerable<Prisma.TransactionPaymentMethodGroupByOutputType, ("amount" | "name")[]> & {
      _sum: {
          amount: number | null;
      };
  })[],
    amountToMonth: {
      year_month: string
      amount: number
    }[]
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