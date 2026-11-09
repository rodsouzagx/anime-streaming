import vine from '@vinejs/vine'

export const createSeasonValidator = vine.create({
  number: vine.number().min(1),
  title: vine.string().trim().maxLength(255).optional(),
})
