import { EpisodeSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Season from '#models/season'

export default class Episode extends EpisodeSchema {
  @belongsTo(() => Season)
  declare season: BelongsTo<typeof Season>
}
