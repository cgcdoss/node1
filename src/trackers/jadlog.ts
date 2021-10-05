import emailController from '../controllers/email';
import http from 'http';

export class Jadlog {
  private respostaAtual = '';
  private intervals: any[] = [];

  private verificaRastreamento(codigoRastreio: string): void {
    console.log('chamou a verificação da jadlog');
    
    const options = {
      host: 'www.jadlog.com.br',
      path: `/siteInstitucional/tracking_dev.jad?cte=${codigoRastreio}` // 07046700335339
    };

    const callback = (response: any) => {
      let str = '';
      response.on('data', (chunck: any) => {
        str += chunck;
      });

      response.on('end', () => {
        if (this.respostaAtual.trim() !== str.trim()) {
          console.log('mudou a resposta');
          emailController.sendEmail({
            remetente: 'contato@cassiogabriel.com',
            destinatario: 'gabi04061997@gmail.com',
            assunto: `Mudou status do código ${codigoRastreio}`,
            // mensagem: `Novo status`,
            html: str
          });
        } else {
          // console.log('mesma resposta');
        }

        this.respostaAtual = str;
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
    }, 1000 * 60 * 5);

    this.intervals.push(interval1, interval2);
  }

  limparIntervals(): void {
    this.intervals.forEach(i => clearInterval(i));
    this.intervals = [];
    this.respostaAtual = '';
  }
}

export default new Jadlog();
