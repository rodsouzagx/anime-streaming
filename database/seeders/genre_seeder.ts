import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Genre from '#models/genre'

export default class extends BaseSeeder {
  async run() {
    await Genre.updateOrCreateMany('slug', [
      { name: 'Ação', slug: 'acao' },
      { name: 'Aventura', slug: 'aventura' },
      { name: 'Comédia', slug: 'comedia' },
      { name: 'Drama', slug: 'drama' },
      { name: 'Esportes', slug: 'esportes' },
      { name: 'Fantasia', slug: 'fantasia' },
      { name: 'Ficção Científica', slug: 'ficcao-cientifica' },
      { name: 'Isekai', slug: 'isekai' },
      { name: 'Mecha', slug: 'mecha' },
      { name: 'Mistério', slug: 'misterio' },
      { name: 'Psicológico', slug: 'psicologico' },
      { name: 'Romance', slug: 'romance' },
      { name: 'Slice of Life', slug: 'slice-of-life' },
      { name: 'Sobrenatural', slug: 'sobrenatural' },
      { name: 'Suspense', slug: 'suspense' },
      { name: 'Terror', slug: 'terror' },
    ])
  }
}
