import express, { Router } from 'express';

class App {
  app = express();
  routes = Router();

  constructor() {
    this.app.use(express.json());

    this.routes.get('/', (req, res) => {
      res.send(
        `Requisições disponíveis: <br><br>
        /somar: recebe dois parametros: a e b <br>
        /sqrt: recebe um parametro: a <br><br>
        Ambos os parametros devem ser passados como queryParams, usando o "?" <br><br>
        Ex.: <b>localhost:3333/somar?a=1&b=2</b>. Nesse caso o result será 3`
      );
    });

    this.routes.get('/somar', (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      const b = parseInt(req?.query?.b as string) || 0;
      res.json({ a, b, result: this.somar(a, b) });
    });

    this.routes.get('/sqrt', (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      res.json({ a, result: this.sqrt(a) });
    });

    this.app.use(this.routes);
  }

  somar(a: number, b: number): number {
    return a + b;
  }

  sqrt(a: number): number {
    return Math.sqrt(a);
  }

}

new App().app.listen(3333);
