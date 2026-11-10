import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import string from '@adonisjs/core/helpers/string'
import Anime from '#models/anime'
import Genre from '#models/genre'
import { createAnimeValidator } from '#validators/anime'

export default class AdminAnimesController {
  async index({ view }: HttpContext) {
    const animes = await Anime.query().orderBy('created_at', 'desc')

    return view.render('pages/admin/animes/index', { animes })
  }

  async show({ params, view }: HttpContext) {
    const anime = await Anime.query()
      .where('id', params.id)
      .preload('seasons', (seasonsQuery) => {
        seasonsQuery.orderBy('number').preload('episodes', (episodesQuery) => {
          episodesQuery.orderBy('number')
        })
      })
      .firstOrFail()

    return view.render('pages/admin/animes/show', { anime })
  }

  async create({ view }: HttpContext) {
    const genres = await Genre.all()
    genres.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

    return view.render('pages/admin/animes/create', { genres })
  }

  async store({ request, response }: HttpContext) {
    const { cover, banner, genres, ...data } = await request.validateUsing(createAnimeValidator)

    const coverName = `${randomUUID()}.${cover.extname}`
    await cover.move(app.makePath('public/uploads/covers'), { name: coverName })

    let bannerPath: string | null = null
    if (banner) {
      const bannerName = `${randomUUID()}.${banner.extname}`
      await banner.move(app.makePath('public/uploads/banners'), { name: bannerName })
      bannerPath = `uploads/banners/${bannerName}`
    }

    const anime = await Anime.create({
      ...data,
      slug: string.slug(data.title, { lower: true }),
      coverPath: `uploads/covers/${coverName}`,
      bannerPath,
    })

    if (genres?.length) {
      await anime.related('genres').attach(genres)
    }

    return response.redirect('/admin/animes')
  }

  async destroy({ params, response }: HttpContext) {
    const anime = await Anime.findOrFail(params.id)
    await anime.delete()

    return response.redirect('/admin/animes')
  }
}
