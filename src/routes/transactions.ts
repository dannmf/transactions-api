import { FastifyInstance } from "fastify/types/instance"
import { knex } from "../database"

export async function transactionRoutes(app: FastifyInstance) {
    app.get('/hello', async () => {
        const tables = knex('sqlite_schema').select('*')
        return tables
    })
}