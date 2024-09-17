import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Transaction } from "@prisma/client";

interface CreateTransactionUseCaseRequest {
  client?: string;
  description: string;
  category?: string;
  subCategory?: string;
  price: number;
  discount?: number;
  tax?: number;
  paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Link de Pagamento' | 'TED';
  date: Date;
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ 
    client, 
    description, 
    category,
    subCategory,
    price, 
    discount, 
    tax,
    paymentMethod,
    date
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = await this.transactionsRepository.create({ 
      client, 
      description, 
      category,
      subCategory,
      price, 
      discount, 
      tax,
      paymentMethod,
      date
    });

    return { transaction }
  }
}