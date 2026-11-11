import { AnimeSchema } from '#database/schema'
import { hasMany, manyToMany, beforeSave } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Season from '#models/season'
import Genre from '#models/genre'
import string from '@adonisjs/core/helpers/string'

export default class Anime extends AnimeSchema {
  static table = 'animes'
  static featuredSlots = 5

  @beforeSave()
  static async generateSlug(anime: Anime) {
    if (!anime.$dirty.title) return

    const cleanTitle = anime.title.replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    const base = string.slug(cleanTitle, { lower: true, strict: true }) || 'anime'

    let slug = base
    let counter = 2

    while (
      await Anime.query()
        .where('slug', slug)
        .if(anime.$isPersisted, (query) => query.whereNot('id', anime.id))
        .first()
    ) {
      slug = `${base}-${counter}`
      counter++
    }

    anime.slug = slug
  }

  @hasMany(() => Season)
  declare seasons: HasMany<typeof Season>

  @manyToMany(() => Genre, { pivotTable: 'anime_genre' })
  declare genres: ManyToMany<typeof Genre>
}
