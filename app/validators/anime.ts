import vine from '@vinejs/vine'

const imageRules = { size: '5mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] }

/**
 * Regras comuns ao cadastro e à edição de anime.
 */
const animeFields = {
  synopsis: vine.string().trim(),
  status: vine.enum(['ongoing', 'finished']),
  releaseYear: vine.number().min(1900).max(2100).optional(),
  studio: vine.string().trim().maxLength(255).optional(),
  ageRating: vine.enum(['L', '10', '12', '14', '16', '18']).optional(),
  banner: vine.file(imageRules).optional(),
  genres: vine.array(vine.number().exists({ table: 'genres', column: 'id' })).optional(),
  isFeatured: vine.boolean().optional(),
}

export const createAnimeValidator = vine.create({
  title: vine.string().trim().maxLength(255).unique({ table: 'animes', column: 'title' }),
  cover: vine.file(imageRules),
  ...animeFields,
})

export const updateAnimeValidator = vine.withMetaData<{ animeId: number }>().create({
  title: vine
    .string()
    .trim()
    .maxLength(255)
    .unique({
      table: 'animes',
      column: 'title',
      filter: (db, _value, field) => {
        db.whereNot('id', field.meta.animeId)
      },
    }),
  cover: vine.file(imageRules).optional(),
  ...animeFields,
})
