import express, { NextFunction, Request, Response, Router } from 'express';
import emailController from './controllers/email';
import dotenv from 'dotenv';

class App {
  app = express();
  routes = Router();

  constructor() {
    dotenv.config();
    
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

    this.routes.get('/somar', this.myHandler, (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      const b = parseInt(req?.query?.b as string) || 0;
      res.json({ a, b, result: this.somar(a, b) });
    });

    this.routes.get('/sqrt', this.myHandler, (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      res.json({ a, result: this.sqrt(a) });
    });

    // outra forma de fazer
    this.routes.route('/sub').get(this.myHandler, (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      const b = parseInt(req?.query?.b as string) || 0;
      res.json({ a, b, result: this.subtrair(a, b) });
    });

    this.routes.post('/email', emailController.enviaEmail);
    this.routes.post('/email-sem-promise', emailController.enviaEmailSemPromise);

    this.middleware();

    this.app.use(this.routes);

    /**
     * Desse jeito as rotas ficam dentro de /myapi 
     * Para usar a rota de soma, por exemplo seria: localhost:3333/myapi/somar?a=1&b=2
     */
    this.app.use('/myapi', this.routes);
  }

  private somar(a: number, b: number): number {
    return a + b;
  }

  private sqrt(a: number): number {
    return Math.sqrt(a);
  }

  private subtrair(a: number, b: number): number {
    return a - b;
  }

  private middleware(): void {
    // As linhas abaixo funcionam da mesma forma
    this.app.use(this.handlerAll);
    this.app.use('/', this.handlerAll);
    this.app.all('*', this.handlerAll);
  }

  private myHandler(req: Request, res: Response, next: NextFunction): void {
    console.log(`Operação ${req.path.replace('/', '')} ${req.query.a} e ${req.query.b}`);
    next();
  }

  private handlerAll(req: Request, res: Response, next: NextFunction): void {
    console.log('caiu no all');
    next();
  }

}

new App().app.listen(3333);
