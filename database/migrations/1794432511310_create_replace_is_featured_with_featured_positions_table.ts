import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'animes'

  async up() {
    // 1. Cria a coluna nova
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('featured_position').nullable().unique()
    })

    // 2. Dá uma posição para os destaques que já existem (no máximo 5)
    this.defer(async (db) => {
      const featured = await db
        .from(this.tableName)
        .where('is_featured', true)
        .orderBy('updated_at', 'desc')
        .limit(5)
        .select('id')

      for (const [index, anime] of featured.entries()) {
        await db
          .from(this.tableName)
          .where('id', anime.id)
          .update({ featured_position: index + 1 })
      }
    })

    // 3. Apaga a coluna antiga
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_featured')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_featured').notNullable().defaultTo(false)
    })

    this.defer(async (db) => {
      await db.from(this.tableName).whereNotNull('featured_position').update({ is_featured: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('featured_position')
    })
  }
}
