import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { updateProfileValidator } from '#validators/profile'

export default class ProfileController {
  async show({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()

    return view.render('pages/profile/show', { user })
  }

  async edit({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()

    return view.render('pages/profile/edit', { user })
  }

  async update({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const { fullName, avatar, removeAvatar } = await request.validateUsing(updateProfileValidator)

    user.fullName = fullName

    if (avatar) {
      const name = `${randomUUID()}.${avatar.extname}`
      await avatar.move(app.makePath('public/uploads/avatars'), { name })
      user.avatarPath = `uploads/avatars/${name}`
    } else if (removeAvatar) {
      user.avatarPath = null
    }

    await user.save()

    session.flash('success', 'Seu perfil foi atualizado.')
    return response.redirect('/profile')
  }
}
