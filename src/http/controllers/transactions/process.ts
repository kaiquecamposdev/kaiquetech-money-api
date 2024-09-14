import { ProcessTransactionsUseCase } from "@/usecases/process-transactions";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const createBodySchema = z.object({
  filepath: z.string(),
})

export async function process(req: FastifyRequest, res: FastifyReply) {
  const { filepath } = createBodySchema.parse(req.body);

  const transactionUseCase = new ProcessTransactionsUseCase()

  const { unregisteredTransactions } = await transactionUseCase.execute({ filepath })

  return res.status(200).send({
    message: 'Dados processados com sucesso!',
    isSuccess: true,
    unregisteredTransactions,
  })
} 