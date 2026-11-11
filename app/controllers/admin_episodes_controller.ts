import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import Season from '#models/season'
import Episode from '#models/episode'
import { createEpisodeValidator, updateEpisodeValidator } from '#validators/episode'

export default class AdminEpisodesController {
  async create({ params, view }: HttpContext) {
    const season = await Season.query()
      .where('id', params.seasonId)
      .preload('anime')
      .preload('episodes')
      .firstOrFail()

    return view.render('pages/admin/episodes/create', { season })
  }

  async store({ params, request, response, session }: HttpContext) {
    const season = await Season.findOrFail(params.seasonId)
    const { video, ...data } = await request.validateUsing(createEpisodeValidator, {
      meta: { seasonId: season.id },
    })

    const videoName = `${randomUUID()}.${video.extname}`
    await video.move(app.makePath('public/uploads/videos'), { name: videoName })

    const episode = await season.related('episodes').create({
      ...data,
      videoPath: `uploads/videos/${videoName}`,
    })

    session.flash('success', `Episódio ${episode.number} adicionado.`)
    return response.redirect(`/admin/animes/${season.animeId}`)
  }

  async edit({ params, view }: HttpContext) {
    const episode = await Episode.query()
      .where('id', params.id)
      .preload('season', (seasonQuery) => {
        seasonQuery.preload('anime')
      })
      .firstOrFail()

    return view.render('pages/admin/episodes/edit', { episode, season: episode.season })
  }

  async update({ params, request, response, session }: HttpContext) {
    const episode = await Episode.query().where('id', params.id).preload('season').firstOrFail()
    const { video, ...data } = await request.validateUsing(updateEpisodeValidator, {
      meta: { seasonId: episode.seasonId, episodeId: episode.id },
    })

    episode.merge({ ...data, synopsis: data.synopsis ?? null })

    if (video) {
      const videoName = `${randomUUID()}.${video.extname}`
      await video.move(app.makePath('public/uploads/videos'), { name: videoName })
      episode.videoPath = `uploads/videos/${videoName}`
    }

    await episode.save()

    session.flash('success', `Episódio ${episode.number} atualizado.`)
    return response.redirect(`/admin/animes/${episode.season.animeId}`)
  }

  async destroy({ params, response, session }: HttpContext) {
    const episode = await Episode.findOrFail(params.id)
    await episode.delete()

    session.flash('success', `"${episode.title}" foi removido.`)
    return response.redirect().back()
  }
}
