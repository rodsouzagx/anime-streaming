import vine from '@vinejs/vine'

export const createEpisodeValidator = vine.create({
  number: vine.number().min(1),
  title: vine.string().trim().maxLength(255),
  synopsis: vine.string().trim().optional(),
  video: vine.file({ size: '500mb', extnames: ['mp4', 'webm'] }),
})
