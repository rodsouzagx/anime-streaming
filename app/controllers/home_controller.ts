import type { HttpContext } from '@adonisjs/core/http'
import Anime from '#models/anime'
import Genre from '#models/genre'

export default class HomeController {
  async index({ view }: HttpContext) {
    const featured = await Anime.query()
      .where('is_featured', true)
      .preload('genres')
      .orderBy('updated_at', 'desc')
      .limit(5)

    const recent = await Anime.query().orderBy('created_at', 'desc').limit(12)

    const genres = await Genre.query()
      .has('animes')
      .preload('animes', (animesQuery) => {
        animesQuery.orderBy('title')
      })
    genres.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

    featured.forEach((anime) => anime.genres.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))

    return view.render('pages/home', { featured, recent, genres })
  }
}
