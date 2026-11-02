import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Conexão padrão usada em todas as consultas.
   */
  connection: 'pg',

  /**
   * Formata o SQL nos logs de desenvolvimento.
   */
  prettyPrintDebugQueries: true,

  connections: {
    /**
     * PostgreSQL (rodando no Docker, ver docker-compose.yml).
     */
    pg: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      schemaGeneration: {
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },
      /**
       * Mostra as consultas SQL no terminal em desenvolvimento.
       */
      debug: app.inDev,
    },
  },
})

export default dbConfig
