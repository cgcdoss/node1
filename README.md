# API de teste em Node.js

### Para fazer deploy no Heroku pode ser de duas formas, conforme [documentação do Heroku](https://devcenter.heroku.com/articles/deploying-nodejs#specifying-a-start-script):

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
