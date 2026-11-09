import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import Season from '#models/season'
import Episode from '#models/episode'
import { createEpisodeValidator } from '#validators/episode'

export default class AdminEpisodesController {
  async create({ params, view }: HttpContext) {
    const season = await Season.query()
      .where('id', params.seasonId)
      .preload('anime')
      .preload('episodes')
      .firstOrFail()

    return view.render('pages/admin/episodes/create', { season })
  }

  async index({ view }: HttpContext) {
    const episodes = await Episode.query()
      .preload('season', (seasonQuery) => {
        seasonQuery.preload('anime')
      })
      .orderBy('created_at', 'desc')

    return view.render('pages/admin/episodes/index', { episodes })
  }

  async store({ params, request, response }: HttpContext) {
    const season = await Season.findOrFail(params.seasonId)
    const { video, ...data } = await request.validateUsing(createEpisodeValidator)

    const videoName = `${randomUUID()}.${video.extname}`
    await video.move(app.makePath('public/uploads/videos'), { name: videoName })

    await season.related('episodes').create({
      ...data,
      videoPath: `uploads/videos/${videoName}`,
    })

    return response.redirect(`/admin/animes/${season.animeId}`)
  }

  async destroy({ params, response }: HttpContext) {
    const episode = await Episode.query().where('id', params.id).preload('season').firstOrFail()

    await episode.delete()

    return response.redirect().back()
  }
}
