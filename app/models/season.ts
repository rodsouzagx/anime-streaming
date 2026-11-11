import { SeasonSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Anime from '#models/anime'
import Episode from '#models/episode'

export default class Season extends SeasonSchema {
  @belongsTo(() => Anime)
  declare anime: BelongsTo<typeof Anime>

  @hasMany(() => Episode)
  declare episodes: HasMany<typeof Episode>

  get label() {
    return this.title ? `Temporada ${this.number}: ${this.title}` : `Temporada ${this.number}`
  }
}
