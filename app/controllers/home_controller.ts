import type { HttpContext } from '@adonisjs/core/http'
import Anime from '#models/anime'
import Genre from '#models/genre'

export default class HomeController {
  async index({ view }: HttpContext) {
    const featured = await Anime.query()
      .whereNotNull('featured_position')
      .preload('genres')
      .orderBy('featured_position')

    featured.forEach((anime) => anime.genres.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))

    const recent = await Anime.query().orderBy('created_at', 'desc').limit(12)

    const genres = await Genre.query()
      .has('animes')
      .withCount('animes')
      .preload('animes', (animesQuery) => {
        animesQuery.orderBy('title')
      })
    genres.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

    const genreRows = genres.filter((genre) => genre.$extras.animes_count >= 2)

    return view.render('pages/home', { featured, recent, genres, genreRows })
  }
}
