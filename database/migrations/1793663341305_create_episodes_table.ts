import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'episodes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('season_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('seasons')
        .onDelete('CASCADE')

      table.integer('number').notNullable()
      table.string('title').notNullable()
      table.text('synopsis').nullable()
      table.string('video_path').notNullable()
      table.integer('duration_seconds').nullable()

      table.unique(['season_id', 'number'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
