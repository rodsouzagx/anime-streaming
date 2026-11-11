import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Anime from '#models/anime'
import { addFeaturedValidator } from '#validators/featured'

export default class AdminFeaturedController {
  async index({ view }: HttpContext) {
    const featured = await Anime.query().whereNotNull('featured_position')
    const candidates = await Anime.query().whereNull('featured_position').orderBy('title')

    const slots = []
    for (let position = 1; position <= Anime.featuredSlots; position++) {
      slots.push({
        position,
        anime: featured.find((anime) => anime.featuredPosition === position) ?? null,
      })
    }

    return view.render('pages/admin/featured/index', {
      slots,
      candidateOptions: [
        { value: '', label: 'Escolher anime...' },
        ...candidates.map((anime) => ({ value: anime.id, label: anime.title })),
      ],
    })
  }

  async store({ request, response, session }: HttpContext) {
    const { animeId, position } = await request.validateUsing(addFeaturedValidator)

    const anime = await Anime.findOrFail(animeId)
    anime.featuredPosition = position
    await anime.save()

    session.flash('success', `"${anime.title}" está na posição ${position}.`)
    return response.redirect('/admin/featured')
  }

  async move({ params, request, response }: HttpContext) {
    const anime = await Anime.findOrFail(params.id)
    const from = anime.featuredPosition
    const to = request.input('direction') === 'up' ? from! - 1 : from! + 1

    if (!from || to < 1 || to > Anime.featuredSlots) {
      return response.redirect('/admin/featured')
    }

    await db.transaction(async (trx) => {
      const neighbor = await Anime.query({ client: trx }).where('featured_position', to).first()
      anime.useTransaction(trx)

      if (neighbor) {
        neighbor.featuredPosition = null
        await neighbor.save()
      }

      anime.featuredPosition = to
      await anime.save()

      if (neighbor) {
        neighbor.featuredPosition = from
        await neighbor.save()
      }
    })

    return response.redirect('/admin/featured')
  }

  async destroy({ params, response, session }: HttpContext) {
    const anime = await Anime.findOrFail(params.id)
    anime.featuredPosition = null
    await anime.save()

    session.flash('success', `"${anime.title}" saiu dos destaques.`)
    return response.redirect('/admin/featured')
  }
}
