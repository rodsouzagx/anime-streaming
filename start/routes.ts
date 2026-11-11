import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'index']).as('home')

// Catálogo público
router.get('/animes', [controllers.Animes, 'index']).as('animes.index')
router.get('/animes/:slug', [controllers.Animes, 'show']).as('animes.show')
router.get('/animes/:slug/episodes/:episodeId', [controllers.Animes, 'watch']).as('animes.watch')

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
    router.post('logout', [controllers.Session, 'destroy'])

    // Perfil
    router.get('/profile', [controllers.Profile, 'show']).as('profile.show')
    router.get('/profile/edit', [controllers.Profile, 'edit']).as('profile.edit')
    router.put('/profile', [controllers.Profile, 'update']).as('profile.update')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [controllers.AdminDashboard, 'index']).as('admin.dashboard')
    router.get('/users', [controllers.AdminUsers, 'index']).as('admin.users.index')

    // Animes
    router.get('/animes', [controllers.AdminAnimes, 'index']).as('admin.animes.index')
    router.get('/animes/create', [controllers.AdminAnimes, 'create']).as('admin.animes.create')
    router.post('/animes', [controllers.AdminAnimes, 'store']).as('admin.animes.store')
    router.get('/animes/:id', [controllers.AdminAnimes, 'show']).as('admin.animes.show')
    router.get('/animes/:id/edit', [controllers.AdminAnimes, 'edit']).as('admin.animes.edit')
    router.put('/animes/:id', [controllers.AdminAnimes, 'update']).as('admin.animes.update')
    router.delete('/animes/:id', [controllers.AdminAnimes, 'destroy']).as('admin.animes.destroy')

    // Temporadas
    router
      .post('/animes/:animeId/seasons', [controllers.AdminSeasons, 'store'])
      .as('admin.seasons.store')
    router.delete('/seasons/:id', [controllers.AdminSeasons, 'destroy']).as('admin.seasons.destroy')
    router.get('/seasons/:id/edit', [controllers.AdminSeasons, 'edit']).as('admin.seasons.edit')
    router.put('/seasons/:id', [controllers.AdminSeasons, 'update']).as('admin.seasons.update')
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
    router.get('/episodes/:id/edit', [controllers.AdminEpisodes, 'edit']).as('admin.episodes.edit')
    router.put('/episodes/:id', [controllers.AdminEpisodes, 'update']).as('admin.episodes.update')
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])
