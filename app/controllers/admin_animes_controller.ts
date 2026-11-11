import type { HttpContext } from '@adonisjs/core/http'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import Anime from '#models/anime'
import Genre from '#models/genre'
import { createAnimeValidator, updateAnimeValidator } from '#validators/anime'

export default class AdminAnimesController {
  async index({ request, view }: HttpContext) {
    const search = request.input('q', '').trim()

    const animes = await Anime.query()
      .if(search, (query) => {
        query.whereILike('title', `%${search}%`)
      })
      .orderBy('created_at', 'desc')

    const featured = await Anime.query()
      .whereNotNull('featured_position')
      .count('* as total')
      .first()
    const featuredCount = Number(featured?.$extras.total ?? 0)

    return view.render('pages/admin/animes/index', {
      animes,
      search,
      featuredCount,
      featuredSlots: Anime.featuredSlots,
    })
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
    const genres = await this.#allGenres()

    return view.render('pages/admin/animes/create', { genres })
  }

  async store({ request, response, session }: HttpContext) {
    const { cover, banner, genres, ...data } = await request.validateUsing(createAnimeValidator)

    const anime = await Anime.create({
      ...data,
      coverPath: await this.#storeImage(cover, 'covers'),
      bannerPath: banner ? await this.#storeImage(banner, 'banners') : null,
    })

    if (genres?.length) {
      await anime.related('genres').attach(genres)
    }

    session.flash('success', `"${anime.title}" foi cadastrado.`)
    return response.redirect(`/admin/animes/${anime.id}`)
  }

  async edit({ params, view }: HttpContext) {
    const anime = await Anime.query().where('id', params.id).preload('genres').firstOrFail()
    const genres = await this.#allGenres()
    const selectedGenres = anime.genres.map((genre) => genre.id)

    return view.render('pages/admin/animes/edit', { anime, genres, selectedGenres })
  }
  async update({ params, request, response, session }: HttpContext) {
    const anime = await Anime.findOrFail(params.id)
    const { cover, banner, genres, ...data } = await request.validateUsing(updateAnimeValidator, {
      meta: { animeId: anime.id },
    })

    anime.merge(data)

    if (cover) {
      anime.coverPath = await this.#storeImage(cover, 'covers')
    }
    if (banner) {
      anime.bannerPath = await this.#storeImage(banner, 'banners')
    }

    await anime.save()
    await anime.related('genres').sync(genres ?? [])

    session.flash('success', 'As alterações foram salvas.')
    return response.redirect(`/admin/animes/${anime.id}`)
  }

  async destroy({ params, response, session }: HttpContext) {
    const anime = await Anime.findOrFail(params.id)
    await anime.delete()

    session.flash('success', `"${anime.title}" foi removido.`)
    return response.redirect('/admin/animes')
  }

  /**
   * Todos os gêneros, em ordem alfabética (com as regras do português).
   */
  async #allGenres() {
    const genres = await Genre.all()
    return genres.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }

  /**
   * Salva uma imagem enviada em public/uploads/<pasta> e devolve o caminho.
   */
  async #storeImage(file: MultipartFile, folder: string) {
    const name = `${randomUUID()}.${file.extname}`
    await file.move(app.makePath(`public/uploads/${folder}`), { name })

    return `uploads/${folder}/${name}`
  }
}
