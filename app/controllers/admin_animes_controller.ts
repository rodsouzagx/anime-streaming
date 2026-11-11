import type { HttpContext } from '@adonisjs/core/http'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import string from '@adonisjs/core/helpers/string'
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

    const featuredCount = (await Anime.query().whereNotNull('featured_position')).length

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
    const featuredOptions = await this.#featuredOptions()

    return view.render('pages/admin/animes/create', { genres, featuredOptions })
  }

  async store({ request, response, session }: HttpContext) {
    const { cover, banner, genres, ...data } = await request.validateUsing(createAnimeValidator)

    const anime = await Anime.create({
      ...data,
      slug: string.slug(data.title, { lower: true }),
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
    const featuredOptions = await this.#featuredOptions(anime.id)

    return view.render('pages/admin/animes/edit', {
      anime,
      genres,
      selectedGenres,
      featuredOptions,
    })
  }
  async update({ params, request, response, session }: HttpContext) {
    const anime = await Anime.findOrFail(params.id)
    const { cover, banner, genres, ...data } = await request.validateUsing(updateAnimeValidator, {
      meta: { animeId: anime.id },
    })

    anime.merge({
      ...data,
      slug: string.slug(data.title, { lower: true }),
      featuredPosition: data.featuredPosition ?? null,
    })

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

  /**
   * As opções de posição de destaque, mostrando quais estão ocupadas e por quem.
   * O anime sendo editado não conta como ocupando a própria posição.
   */
  async #featuredOptions(currentAnimeId?: number) {
    const occupied = await Anime.query().whereNotNull('featured_position')

    const options: { value: string | number; label: string; disabled?: boolean }[] = [
      { value: '', label: 'Não destacar' },
    ]

    for (let position = 1; position <= Anime.featuredSlots; position++) {
      const occupant = occupied.find(
        (anime) => anime.featuredPosition === position && anime.id !== currentAnimeId
      )

      options.push({
        value: position,
        label: occupant
          ? `Posição ${position} · ocupada por ${occupant.title}`
          : `Posição ${position} · livre`,
        disabled: Boolean(occupant),
      })
    }

    return options
  }
}
