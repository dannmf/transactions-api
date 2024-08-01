import { FastifyInstance } from 'fastify/types/instance'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')
    return { transactions }
  })

  app.get('/:id', async (request) => {
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamSchema.parse(request.params)

    const transaction = await knex('transactions')
      .select('*')
      .where({ id })
      .first()

    return { transaction }
  })

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.code(201).send()
  })
}
