import type { HttpContext } from '@adonisjs/core/http'
import Anime from '#models/anime'

export default class AdminAnimesController {
  async index({ view }: HttpContext) {
    const animes = await Anime.query().orderBy('created_at', 'desc')

    return view.render('pages/admin/animes/index', { animes })
  }

  async destroy({ params, response }: HttpContext) {
    const anime = await Anime.findOrFail(params.id)
    await anime.delete()

    return response.redirect('/admin/animes')
  }
}
