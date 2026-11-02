import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'anime_genre'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('anime_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('animes')
        .onDelete('CASCADE')

      table
        .integer('genre_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('genres')
        .onDelete('CASCADE')

      table.unique(['anime_id', 'genre_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
