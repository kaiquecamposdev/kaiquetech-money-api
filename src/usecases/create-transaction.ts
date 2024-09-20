import { TransactionsPaymentMethodRepository } from "@/repositories/transaction-payment-method-repository";
import { TransactionsRepository } from "@/repositories/transactions-repository";
import { TransactionsTypeRepository } from "@/repositories/transactions-type-repository";
import { Transaction } from "@prisma/client";

interface CreateTransactionUseCaseRequest {
  client_name?: string;
  description: string;
  category?: string;
  subCategory?: string;
  type: 'INCOME' | 'EXPENSE';
  price: number;
  discount?: number;
  tax?: number;
  paymentMethod: 'CREDIT' | 'DEBIT' | 'MONEY' | 'PIX' | 'PAYMENTLINK' | 'TED';
  date: Date;
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository, private transactionsType: TransactionsTypeRepository, private transactionsPaymentMethod: TransactionsPaymentMethodRepository ) {}

  async execute({ 
    client_name, 
    description, 
    category,
    subCategory,
    type,
    price, 
    discount, 
    tax,
    paymentMethod,
    date
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transactionType = await this.transactionsType.create({
      name: type,
      amount: price - (discount || 0) - (tax || 0)
    })

    const transactionPaymentMethod = await this.transactionsPaymentMethod.create({
      name: paymentMethod,
      amount: price - (discount || 0) - (tax || 0)
    })

    const transaction = await this.transactionsRepository.create({
      client_name, 
      description, 
      category,
      subCategory,
      typeId: transactionType.id,
      type,
      price, 
      discount, 
      tax,
      paymentMethodId: transactionPaymentMethod.id,
      paymentMethod,
      date
    });

    return { transaction }
  }
}