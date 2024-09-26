import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";

interface CreateTransactionUseCaseRequest {
  client_name?: string;
  description: string;
  category?: string;
  sub_category?: string;
  type: 'INCOME' | 'EXPENSE';
  price: number;
  discount?: number;
  tax?: number;
  payment_method: 'CREDIT' | 'DEBIT' | 'MONEY' | 'PIX' | 'PAYMENTLINK' | 'TED';
  date: Date;
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ 
    client_name, 
    description, 
    category,
    sub_category,
    type,
    price, 
    discount, 
    tax,
    payment_method,
    date
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = await this.transactionsRepository.create({
      client_name, 
      description, 
      category,
      sub_category,
      type,
      price, 
      discount, 
      tax,
      payment_method,
      date
    });

    return { transaction }
  }
}