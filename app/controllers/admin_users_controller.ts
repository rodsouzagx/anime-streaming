import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AdminUsersController {
  async index({ view }: HttpContext) {
    const users = await User.query().orderBy('created_at', 'desc')

    return view.render('pages/admin/users/index', { users })
  }
}
