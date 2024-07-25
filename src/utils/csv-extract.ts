import { InvalidFieldTypeError } from '@/usecases/errors/invalid-field-type-error';
import { MissingRequiredFieldsError } from '@/usecases/errors/missing-required-fields-error';
import { Transaction } from '@prisma/client';
import { randomUUID } from 'crypto';
import csvParser from 'csv-parser';
import { pipeline } from 'stream';
import util from "util";
import { z } from 'zod';
import { dateTransform } from './date-transform';

const pump = util.promisify(pipeline)

const csvDataSchema = z.object({
    date: z.string(),
    name: z.string().max(255),
    description: z.string().max(255).nullable(),
    category: z.string().max(255).nullable(),
    subCategory: z.string().max(255).nullable(),
    price: z.coerce.number().default(0),
    discount: z.coerce.number().min(1).default(0).nullable(),
    tax: z.coerce.number().min(1).default(0).nullable(),
    paymentMethod: z.enum(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix']),
})

type CsvDataType = z.infer<typeof csvDataSchema>

export async function csvExtract(csvString: string): Promise<Transaction[]> {
    let transactions: Transaction[] = []
    
    await pump(
        csvString,
        csvParser()
            .on('data', ({
                date,
                name,
                description,
                category,
                subCategory,
                paymentMethod,
                tax,
                discount,
                price,
            }: CsvDataType) => {                     

            if (!name && !price && !discount && !tax) {
                throw new MissingRequiredFieldsError();
            }

            if (isNaN(price || 0) && isNaN(discount || 0) && isNaN(tax || 0)) {
                throw new InvalidFieldTypeError();
            }

            transactions = [
                {
                    id: randomUUID(),
                    date: dateTransform(date),
                    name,
                    description,
                    category,
                    subCategory,
                    price: Number(price),
                    discount: Number(discount), 
                    tax: Number(tax),
                    paymentMethod,
                    created_at: new Date(),
                    updated_at: null
                }, ...transactions
            ]
        })
    )

    return transactions
}
