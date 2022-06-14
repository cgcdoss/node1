import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import emailController from './controllers/email';
import swagger_output from './doc/swagger_output.json';
import jadlog from './trackers/jadlog';
import seduc from './trackers/seduc';

class App {
  private _app = express();
  private _routes = Router();

  constructor() {
    dotenv.config();

    this._app.set('env', {
      port: process.env.PORT || 3333,
      env: process.env.NODE_ENV,
    });

    this._app.use(express.json());
    this._app.use(cors());
    this.setRotas();
    this.setDocs();
    this.middleware();

    this._app.use(this._routes);

    /**
     * Desse jeito as rotas ficam dentro de /myapi 
     * Para usar a rota de soma, por exemplo seria: localhost:3333/myapi/somar?a=1&b=2
     */
    this._app.use('/myapi', this._routes);

    // this.exibeRotas();
  }

  private setRotas() {
    this._routes.get('/', (req, res) => {
      res.send(
        `Requisições disponíveis: <br><br>
        /somar: recebe dois parametros: a e b <br>
        /sqrt: recebe um parametro: a <br><br>
        Ambos os parametros devem ser passados como queryParams, usando o "?" <br><br>
        Ex.: <b>localhost:3333/somar?a=1&b=2</b>. Nesse caso o result será 3  <br><br>
        <hr>
        
        Acesse a <a href="/api-docs">documentação</a>`
      );
    });

    this._routes.get('/somar', this.myHandler, (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      const b = parseInt(req?.query?.b as string) || 0;
      res.json({ a, b, result: this.somar(a, b) });
    });

    this._routes.get('/sqrt', this.myHandler, (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      res.json({ a, result: this.sqrt(a) });
    });

    // outra forma de fazer
    this._routes.route('/sub').get(this.myHandler, (req, res) => {
      const a = parseInt(req?.query?.a as string) || 0;
      const b = parseInt(req?.query?.b as string) || 0;
      res.json({ a, b, result: this.subtrair(a, b) });
    });

    this._routes.get('/somarAll', (req, res) => {
      let numeroFinal = 0;
      for (let prop in req.query) {
        numeroFinal += parseInt(req.query[prop] as string, 10);
      }
      res.json({ numeros: req.query, result: numeroFinal });
    });

    this._routes.get('/math/:expressao/', (req, res) => {
      res.json({ ...req.params, result: eval(req.params.expressao) });
    });

    this._routes.post('/email', emailController.enviaEmail);
    this._routes.post('/email-sem-promise', emailController.enviaEmailSemPromise);

    this._routes.get('/init-jadlog', (req: Request, res: Response) => {
      const codigoRastreio = req.query.codigoRastreio as string;

      if (codigoRastreio && codigoRastreio.length) {
        jadlog.initRastreamento(5, codigoRastreio);
        res.json('tudo ok');
      } else {
        res.status(400).json('Informe a queryParam codigoRastreio na url, tipo ?codigoRastreio=123456');
      }
    });
    this._routes.get('/stop-jadlog', (req: Request, res: Response) => {
      jadlog.limparIntervals();
      res.json('tudo ok');
    });

    // SEDUC
    this._routes.get('/init-seduc', (req: Request, res: Response) => {
      seduc.initRastreamento(5);
      res.json('tudo ok');
    });
    this._routes.get('/stop-seduc', (req: Request, res: Response) => {
      seduc.limparIntervals();
      res.json('tudo ok');
    });

  }

  private setDocs(): void {
    if (this._app.get('env').env === 'local') {
      swagger_output.host = 'localhost:3333';
      swagger_output.schemes = ['http'];
    }
    this._routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger_output));
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

    // this.app.use(this.handlerAll); // é executada quando a base do caminho solicitado corresponde ao path
    // this.app.use('/', this.handlerAll); // é executada quando a base do caminho solicitado corresponde ao path
    this._app.all('*', this.handlerAll); // Este método é semelhante aos métodos app.METHOD(), exceto que corresponde a todos os verbos HTTP.
  }

  private myHandler(req: Request, res: Response, next: NextFunction): void {
    console.log(`Operação ${req.path.replace('/', '')} ${req.query.a} e ${req.query.b}`);
    next();
  }

  private handlerAll(req: Request, res: Response, next: NextFunction): void {
    console.log(`handlerAll - path: ${req.path}`);
    next();
  }

  private exibeRotas(): void {
    this._routes.stack.forEach((r: any) => {
      if (r.route && r.route.path) {
        console.log(r.route.path, ': ', r);
      }
    })
  }

  get app(): express.Application {
    return this._app;
  }

}

// export { App };
export default new App().app;
