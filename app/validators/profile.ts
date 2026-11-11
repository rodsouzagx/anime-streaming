import vine from '@vinejs/vine'

export const updateProfileValidator = vine.create({
  fullName: vine.string().trim().minLength(2).maxLength(255),
  avatar: vine.file({ size: '2mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] }).optional(),
  removeAvatar: vine.boolean().optional(),
})
