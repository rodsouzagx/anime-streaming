import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'animes.index': { paramsTuple?: []; params?: {} }
    'animes.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'animes.watch': { paramsTuple: [ParamValue,ParamValue]; params: {'slug': ParamValue,'episodeId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.episodes.index': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.animes.index': { paramsTuple?: []; params?: {} }
    'admin.animes.create': { paramsTuple?: []; params?: {} }
    'admin.animes.store': { paramsTuple?: []; params?: {} }
    'admin.animes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.animes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.animes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.animes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.seasons.store': { paramsTuple: [ParamValue]; params: {'animeId': ParamValue} }
    'admin.seasons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.episodes.create': { paramsTuple: [ParamValue]; params: {'seasonId': ParamValue} }
    'admin.episodes.store': { paramsTuple: [ParamValue]; params: {'seasonId': ParamValue} }
    'admin.episodes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'animes.index': { paramsTuple?: []; params?: {} }
    'animes.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'animes.watch': { paramsTuple: [ParamValue,ParamValue]; params: {'slug': ParamValue,'episodeId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.episodes.index': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.animes.index': { paramsTuple?: []; params?: {} }
    'admin.animes.create': { paramsTuple?: []; params?: {} }
    'admin.animes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.animes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.episodes.create': { paramsTuple: [ParamValue]; params: {'seasonId': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'animes.index': { paramsTuple?: []; params?: {} }
    'animes.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'animes.watch': { paramsTuple: [ParamValue,ParamValue]; params: {'slug': ParamValue,'episodeId': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.episodes.index': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.animes.index': { paramsTuple?: []; params?: {} }
    'admin.animes.create': { paramsTuple?: []; params?: {} }
    'admin.animes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.animes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.episodes.create': { paramsTuple: [ParamValue]; params: {'seasonId': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.animes.store': { paramsTuple?: []; params?: {} }
    'admin.seasons.store': { paramsTuple: [ParamValue]; params: {'animeId': ParamValue} }
    'admin.episodes.store': { paramsTuple: [ParamValue]; params: {'seasonId': ParamValue} }
  }
  PUT: {
    'admin.animes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin.animes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.seasons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.episodes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}