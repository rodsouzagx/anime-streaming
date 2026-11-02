# Funcionalidades

Plataforma de streaming de animes inspirada na Crunchyroll, desenvolvida como trabalho acadêmico.

## Etapa 1 (entrega: 11/11/2026)

### Área pública

- Cadastro e login de usuários
- Busca de animes pelo nome
- Página do anime: capa, sinopse, gêneros, temporadas e episódios

### Back Office (painel administrativo)

Acessível apenas por usuários com papel `admin`.

- Cadastrar anime (com temporadas e episódios, incluindo upload do vídeo)
- Listar animes
- Editar anime
- Remover anime
- Listar usuários

## Próximas etapas

### Home

- Hero section com animes em destaque
- Populares (mais assistidos)
- Fileiras por gênero
- Apenas logados: Continuar assistindo, Minha Lista e Recomendados

### Assistir

- Player de episódios
- Continuar assistindo de onde parou

### Usuário

- Filtro por gênero
- Comentários nos episódios (criar, editar e apagar os próprios)
- Minha Lista
- Perfil: foto, nome, top 3 favoritos, atividade recente e Minha Lista

## Decisões

- Usuários se cadastram sempre como `user`. O admin é criado por um seeder.
- Os dados dos animes (título, sinopse, capa) são reais, consultados no MyAnimeList/Jikan.
- Os vídeos dos episódios são animações de licença livre (Creative Commons), pois episódios reais são protegidos por direitos autorais.
