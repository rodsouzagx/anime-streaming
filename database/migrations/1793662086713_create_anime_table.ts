import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'animes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('synopsis').notNullable()
      table.string('cover_path').notNullable()
      table.string('banner_path').nullable()
      table.integer('release_year').nullable()
      table.string('studio').nullable()
      table.string('status').notNullable()
      table.string('age_rating').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
