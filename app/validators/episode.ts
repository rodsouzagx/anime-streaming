import vine from '@vinejs/vine'

export const createEpisodeValidator = vine.withMetaData<{ seasonId: number }>().create({
  number: vine
    .number()
    .min(1)
    .unique({
      table: 'episodes',
      column: 'number',
      filter: (db, _value, field) => {
        db.where('season_id', field.meta.seasonId)
      },
    }),
  title: vine.string().trim().maxLength(255),
  synopsis: vine.string().trim().optional(),
  video: vine.file({ size: '500mb', extnames: ['mp4', 'webm'] }),
})

export const updateEpisodeValidator = vine
  .withMetaData<{ seasonId: number; episodeId: number }>()
  .create({
    number: vine
      .number()
      .min(1)
      .unique({
        table: 'episodes',
        column: 'number',
        filter: (db, _value, field) => {
          db.where('season_id', field.meta.seasonId).whereNot('id', field.meta.episodeId)
        },
      }),
    title: vine.string().trim().maxLength(255),
    synopsis: vine.string().trim().optional(),
    video: vine.file({ size: '500mb', extnames: ['mp4', 'webm'] }).optional(),
  })
