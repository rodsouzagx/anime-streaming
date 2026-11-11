import vine from '@vinejs/vine'
import Anime from '#models/anime'

export const addFeaturedValidator = vine.create({
  animeId: vine.number().exists({ table: 'animes', column: 'id' }),
  position: vine
    .number()
    .min(1)
    .max(Anime.featuredSlots)
    .unique({ table: 'animes', column: 'featured_position' }),
})
