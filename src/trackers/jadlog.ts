import emailController from '../controllers/email';
import http from 'https';

export class Jadlog {
  private tbodyAtual = '';
  private intervals: any[] = [];

  private verificaRastreamento(codigoRastreio: string): void {
    console.log('chamou a verificação da jadlog');

    const options = {
      host: 'jadlog.com.br',
      path: `/siteInstitucional/tracking_dev.jad?cte=${codigoRastreio}` // 07046700335339
    };

    const callback = (response: any) => {
      let str = '';
      response.on('data', (chunck: any) => {
        str += chunck;
      });

      response.on('end', () => {
        let tbodyRequest = str.trim().substring(str.trim().search(/<tbody.*>/), str.trim().search(/<\/tbody>/)); // pega o tbody todo
        tbodyRequest = tbodyRequest.substring(tbodyRequest.indexOf('<tr')); // skipa do <tbody... Para pegar somente o conteúdo do tbody

        if (this.tbodyAtual.length && this.tbodyAtual.trim() !== tbodyRequest.trim()) {
          console.log('mudou a resposta. \nAntes:', this.tbodyAtual, ' \ndepois:', str);

          emailController.sendEmail({
            remetente: 'contato@cassiogabriel.com',
            destinatario: 'gabi04061997@gmail.com',
            assunto: `Mudou status do código ${codigoRastreio}`,
            // mensagem: `Novo status`,
            html: str
          });
        } else {
          console.log('mesma resposta');
        }

        this.tbodyAtual = tbodyRequest;
      });
    };

    http.request(options, callback).end();
  }

  autoChamadaHeroku(): void {
    const options = {
      host: 'cgcnode.herokuapp.com',
      path: '/api-docs/'
    };

    const callback = (response: any) => {
      let str = '';
      response.on('data', (chunck: any) => {
        str += chunck;
      });

      response.on('end', () => {
        console.log('rechamou o heroku');
      });
    };

    http.request(options, callback).end();
  }

  initRastreamento(minutos: number, codigoRastreio: string): void {
    const interval1 = setInterval(() => {
      this.verificaRastreamento(codigoRastreio);
    }, 1000 * 60 * minutos); // a cada x minutos

    const interval2 = setInterval(() => {
      this.autoChamadaHeroku();
    }, 1000 * 60 * 25);

    this.intervals.push(interval1, interval2);
  }

  limparIntervals(): void {
    this.intervals.forEach(i => clearInterval(i));
    this.intervals = [];
    this.tbodyAtual = '';
  }
}

export default new Jadlog();
