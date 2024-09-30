import csvParser from 'csv-parser';
import dayjs from 'dayjs';
import fs from 'node:fs';
import { z } from "zod";
import { InvalidFieldTypeError } from './errors/invalid-field-type-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

const numberFromString = z.string().transform((val) => parseFloat(val.replace(',', '.')));

const csvDataSchema = z.object({
    client: z.string().optional(),
    description: z.string().max(255),
    category: z.string().optional(),
    sub_category: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE']),
    price: numberFromString.refine((value) => !isNaN(value)),
    discount: numberFromString.refine((value) => !isNaN(value)).optional(),
    tax: numberFromString.refine((value) => !isNaN(value)).optional(),
    payment_method: z.string().transform((value) => {
      const paymentMethods: {
        [key: string]: string
      } = {
        'Cartão de Crédito': 'CREDIT',
        'Cartão de Débito': 'DEBIT',
        'Dinheiro': 'MONEY',
        'Pix': 'PIX',
        'Link de Pagamento': 'PAYMENTLINK',
        'TED': 'TED',
      }

      return paymentMethods[value]
    }),
    date: z.string().transform((str) => {
      const [date, time] = str.split(" ");

      const [day, month, year] = date.split("/");
      const [hours, minutes, seconds] = time.split(":");
      const dateFormatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      const dateTransformed = dayjs(dateFormatted).format();

      return dateTransformed
    })
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
          const { success, data: transaction, error } = csvDataSchema.safeParse(data)

          if (!success) {
            console.error(error.errors)
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