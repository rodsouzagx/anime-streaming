import vine from '@vinejs/vine'

export const createSeasonValidator = vine.withMetaData<{ animeId: number }>().compile(
  vine.object({
    number: vine
      .number()
      .min(1)
      .unique({
        table: 'seasons',
        column: 'number',
        filter: (db, _value, field) => {
          db.where('anime_id', field.meta.animeId)
        },
      }),
    title: vine.string().trim().maxLength(255).optional(),
  })
)
