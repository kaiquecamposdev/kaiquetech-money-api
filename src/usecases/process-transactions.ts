import csvParser from 'csv-parser';
import fs from 'node:fs';
import { z } from "zod";
import { InvalidFieldTypeError } from './errors/invalid-field-type-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

const csvDataSchema = z.object({
    client: z.string().optional(),
    description: z.string().max(255),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    price: z.coerce.number().default(0),
    discount: z.coerce.number().optional().default(0),
    tax: z.coerce.number().optional().default(0),
    paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix']),
    date: z.coerce.date(),
  })

type CsvDataSchemaType = z.infer<typeof csvDataSchema>

interface ProcessTransactionsUseCaseRequest {
  filepath: string;
}

interface ProcessTransactionsUseCaseResponse {
  unregisteredTransactions: CsvDataSchemaType[]
}

export class ProcessTransactionsUseCase {
  async execute({ 
    filepath
  }: ProcessTransactionsUseCaseRequest): Promise<ProcessTransactionsUseCaseResponse> {
    let unregisteredTransactions: CsvDataSchemaType[] = []
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(filepath)
        .pipe(csvParser())
        .on('data', (data) => {
          const { success, data: transaction } = csvDataSchema.safeParse(data)

          if (!success) {
            throw new InvalidFieldTypeError()
          }

          unregisteredTransactions.push(transaction);
        })
        .on('end', resolve)
        .on('error', reject)
      })

    if (unregisteredTransactions.length <= 0) {
      throw new ResourceNotFoundError()
    }

    return { unregisteredTransactions }
  }
}