import { app } from '@/app'
import { env } from '@/env'
import { transactionsRoutes } from '@/http/controllers/transactions/routes'

app.register(transactionsRoutes)

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log(`🚀 Server is listening on port ${env.PORT}`))