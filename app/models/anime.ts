import { AnimeSchema } from '#database/schema'
import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Season from '#models/season'
import Genre from '#models/genre'

export default class Anime extends AnimeSchema {
  static table = 'animes'

  @hasMany(() => Season)
  declare seasons: HasMany<typeof Season>

  @manyToMany(() => Genre, { pivotTable: 'anime_genre' })
  declare genres: ManyToMany<typeof Genre>
}
