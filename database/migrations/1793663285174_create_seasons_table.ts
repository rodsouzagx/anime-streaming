import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seasons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('anime_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('animes')
        .onDelete('CASCADE')

      table.integer('number').notNullable()
      table.string('title').nullable()

      table.unique(['anime_id', 'number'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
