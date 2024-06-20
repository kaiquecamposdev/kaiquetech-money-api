import { Prisma, Transaction } from '@prisma/client'
import { randomUUID } from 'crypto'
import { TransactionsRepository } from '../transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async findMany(page: number) {
    return this.items
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction: Transaction = {
      id: randomUUID(),
      name: data.name,
      price: data.price,
      discount: data.discount || 0,
      tax: data.tax || 0,
      total: data.price - (data.discount || 0) + (data.tax || 0),
      description: data.description || '',
      category: data.category || '',
      paymentMethod: data.paymentMethod || '',
      created_at: new Date(),
      updated_at: null,
    }
  
    this.items.push(transaction)
  
    return transaction
  }

  async update(id: string, transaction: Transaction) {
    const transactionIndex = this.items.findIndex((item) => item.id === id)

    if (transactionIndex >= 0) {
      this.items[transactionIndex] = transaction
    }

    return transaction
  }

  async delete(id: string) {
    const transactionIndex = this.items.findIndex((item) => item.id === id)

    if (transactionIndex >= 0) {
      this.items.slice(transactionIndex)
    }
  }
}