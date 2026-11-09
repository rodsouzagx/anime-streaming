import type { HttpContext } from '@adonisjs/core/http'
import Anime from '#models/anime'
import Episode from '#models/episode'
import User from '#models/user'

export default class AdminDashboardController {
  async index({ view }: HttpContext) {
    const [animesCount, episodesCount, usersCount] = await Promise.all([
      Anime.query().count('* as total').first(),
      Episode.query().count('* as total').first(),
      User.query().count('* as total').first(),
    ])

    return view.render('pages/admin/dashboard', {
      stats: {
        animes: Number(animesCount?.$extras.total ?? 0),
        episodes: Number(episodesCount?.$extras.total ?? 0),
        users: Number(usersCount?.$extras.total ?? 0),
      },
    })
  }
}
