import { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from "node:url";
import { InvalidCsvFormatError } from "./errors/invalid-csv-format-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UploadTransactionUseCaseRequest {
  data: MultipartFile | undefined
}

interface UploadTransactionUseCaseResponse {
  filepath: string
}

export class UploadTransactionUseCase {
  async execute({
    data
  }: UploadTransactionUseCaseRequest): Promise<UploadTransactionUseCaseResponse> {
    if (!data) {
      throw new ResourceNotFoundError()
    }
  
    if (data.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || data.mimetype === 'application/vnd.ms-excel') {
      throw new InvalidCsvFormatError()
    }

    const filename = data?.filename;
    const filebuffer = await data?.toBuffer();
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const uploadDir = path.join(path.dirname(__dirname), 'temp');

    fs.mkdirSync(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, `${randomUUID()}-${filename?.trim()}`);
    await fs.promises.writeFile(filepath, filebuffer || '');

    return { filepath }
  }

}