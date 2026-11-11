import type { HttpContext } from '@adonisjs/core/http'
import Anime from '#models/anime'
import Season from '#models/season'
import { createSeasonValidator } from '#validators/season'

export default class AdminSeasonsController {
  async store({ params, request, response, session }: HttpContext) {
    const anime = await Anime.findOrFail(params.animeId)
    const data = await request.validateUsing(createSeasonValidator, {
      meta: { animeId: anime.id },
    })

    const season = await anime.related('seasons').create(data)

    session.flash('success', `Temporada ${season.number} adicionada.`)
    return response.redirect(`/admin/animes/${anime.id}`)
  }

  async destroy({ params, response, session }: HttpContext) {
    const season = await Season.findOrFail(params.id)
    const animeId = season.animeId

    await season.delete()

    session.flash('success', `Temporada ${season.number} removida.`)
    return response.redirect(`/admin/animes/${animeId}`)
  }
}
