# API de teste em Node.js

## Para fazer deploy no Heroku pode ser de duas formas, conforme [documentação do Heroku](https://devcenter.heroku.com/articles/deploying-nodejs#specifying-a-start-script):

Através do arquivo Procfile (do Heroku), esse arquivo deve ter, por exemplo, um conteúdo tipo:

```Procfile
web: npm run start:heroku
```

e no package.json:

```json
...
  "scripts": {
    ...
    "start:heroku": "node dist/server.js",
    "build": "tsc --build"
    ...
  }
...
```

---

Ou através do script `start`, então para rodar localmente precisaria ter um outro script para rodar a API localmente (tipo `start:dev`) e o script `start` ficaria para rodar em produção (Heroku)

## Para fazer deploy no Vercel:

- Deve haver um arquivo de configuração do Vercel ([Vercel.json](vercel.json))

- Para fazer deploy seguir passo a passo abaixo:

```
$ npm install
$ npm install vercel -g
$ vercel (ou vercel --prod)
```
