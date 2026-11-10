import User from '#models/user'
import { loginValidator } from '#validators/user'
import { errors } from '@adonisjs/auth'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Cuida do login e do logout dos usuários.
 */
export default class SessionController {
  /**
   * Mostra a página de login
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Confere o e-mail e a senha e inicia a sessão
   */
  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect(user.role === 'admin' ? '/admin' : '/animes')
    } catch (error) {
      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        session.flash('error', 'E-mail ou senha incorretos.')
        session.flashExcept(['password'])
        return response.redirect().back()
      }

      throw error
    }
  }

  /**
   * Encerra a sessão
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/animes')
  }
}
