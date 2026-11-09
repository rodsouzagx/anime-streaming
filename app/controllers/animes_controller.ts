import type { HttpContext } from '@adonisjs/core/http'
import Anime from '#models/anime'
import Episode from '#models/episode'

export default class AnimesController {
  async index({ request, view }: HttpContext) {
    const search = request.input('q', '').trim()

    const animes = await Anime.query()
      .if(search, (query) => {
        query.whereILike('title', `%${search}%`)
      })
      .orderBy('title')

    return view.render('pages/animes/index', { animes, search })
  }

  async show({ params, view }: HttpContext) {
    const anime = await Anime.query()
      .where('slug', params.slug)
      .preload('genres')
      .preload('seasons', (seasonsQuery) => {
        seasonsQuery.orderBy('number').preload('episodes', (episodesQuery) => {
          episodesQuery.orderBy('number')
        })
      })
      .firstOrFail()

    return view.render('pages/animes/show', { anime })
  }

  async watch({ params, view }: HttpContext) {
    const anime = await Anime.findByOrFail('slug', params.slug)

    const episode = await Episode.query()
      .where('id', params.episodeId)
      .whereHas('season', (seasonQuery) => {
        seasonQuery.where('anime_id', anime.id)
      })
      .preload('season')
      .firstOrFail()

    return view.render('pages/animes/watch', { anime, episode })
  }
}
