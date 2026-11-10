import type { HttpContext } from '@adonisjs/core/http'
import Anime from '#models/anime'

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

    anime.genres.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

    return view.render('pages/animes/show', { anime })
  }

  async watch({ params, view }: HttpContext) {
    const anime = await Anime.query()
      .where('slug', params.slug)
      .preload('seasons', (seasonsQuery) => {
        seasonsQuery.orderBy('number').preload('episodes', (episodesQuery) => {
          episodesQuery.orderBy('number')
        })
      })
      .firstOrFail()

    const episodes = anime.seasons.flatMap((season) => season.episodes)
    const currentIndex = episodes.findIndex((episode) => episode.id === Number(params.episodeId))

    if (currentIndex === -1) {
      return view.render('pages/errors/not_found')
    }

    const episode = episodes[currentIndex]
    const season = anime.seasons.find((item) => item.id === episode.seasonId)!
    const nextEpisode = episodes[currentIndex + 1] ?? null

    return view.render('pages/animes/watch', { anime, episode, season, nextEpisode })
  }
}
