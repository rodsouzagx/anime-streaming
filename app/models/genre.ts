import { GenreSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Anime from '#models/anime'

export default class Genre extends GenreSchema {
  @manyToMany(() => Anime, { pivotTable: 'anime_genre' })
  declare animes: ManyToMany<typeof Anime>
}
