import { UploadTransactionUseCase } from "@/usecases/upload-transactions";
import { FastifyReply, FastifyRequest } from "fastify";

export async function upload(req: FastifyRequest, res: FastifyReply) {
  const data = await req.file();

  const transactionUseCase = new UploadTransactionUseCase()

  const { filepath } = await transactionUseCase.execute({
    data
  })

  return res.send({ 
    message: 'Arquivo enviado com sucesso!',
    isSuccess: true,
    filepath,
  });
} 