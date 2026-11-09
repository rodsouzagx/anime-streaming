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

    router.get('/animes', [controllers.AdminAnimes, 'index']).as('admin.animes.index')
    router.delete('/animes/:id', [controllers.AdminAnimes, 'destroy']).as('admin.animes.destroy')
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])
