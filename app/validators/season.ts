import vine from '@vinejs/vine'

export const createSeasonValidator = vine.withMetaData<{ animeId: number }>().create({
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

export const updateSeasonValidator = vine
  .withMetaData<{ animeId: number; seasonId: number }>()
  .create({
    number: vine
      .number()
      .min(1)
      .unique({
        table: 'seasons',
        column: 'number',
        filter: (db, _value, field) => {
          db.where('anime_id', field.meta.animeId).whereNot('id', field.meta.seasonId)
        },
      }),
    title: vine.string().trim().maxLength(255).optional(),
  })
