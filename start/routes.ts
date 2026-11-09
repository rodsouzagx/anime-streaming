/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/dashboard').render('pages/dashboard').as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.on('/').render('pages/admin/dashboard').as('admin.dashboard')
    router.get('/users', [controllers.AdminUsers, 'index']).as('admin.users.index')

    // Animes
    router.get('/animes', [controllers.AdminAnimes, 'index']).as('admin.animes.index')
    router.get('/animes/create', [controllers.AdminAnimes, 'create']).as('admin.animes.create')
    router.post('/animes', [controllers.AdminAnimes, 'store']).as('admin.animes.store')
    router.get('/animes/:id', [controllers.AdminAnimes, 'show']).as('admin.animes.show')
    router.delete('/animes/:id', [controllers.AdminAnimes, 'destroy']).as('admin.animes.destroy')

    // Temporadas
    router
      .post('/animes/:animeId/seasons', [controllers.AdminSeasons, 'store'])
      .as('admin.seasons.store')
    router.delete('/seasons/:id', [controllers.AdminSeasons, 'destroy']).as('admin.seasons.destroy')

    // Episódios
    router
      .get('/seasons/:seasonId/episodes/create', [controllers.AdminEpisodes, 'create'])
      .as('admin.episodes.create')
    router
      .post('/seasons/:seasonId/episodes', [controllers.AdminEpisodes, 'store'])
      .as('admin.episodes.store')
    router
      .delete('/episodes/:id', [controllers.AdminEpisodes, 'destroy'])
      .as('admin.episodes.destroy')
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])
