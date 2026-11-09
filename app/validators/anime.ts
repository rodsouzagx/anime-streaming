import vine from '@vinejs/vine'

const imageRules = { size: '5mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] }

export const createAnimeValidator = vine.create({
  title: vine.string().trim().maxLength(255).unique({ table: 'animes', column: 'title' }),
  synopsis: vine.string().trim(),
  status: vine.enum(['ongoing', 'finished']),
  releaseYear: vine.number().min(1900).max(2100).optional(),
  studio: vine.string().trim().maxLength(255).optional(),
  ageRating: vine.enum(['L', '10', '12', '14', '16', '18']).optional(),
  cover: vine.file(imageRules),
  banner: vine.file(imageRules).optional(),
})
