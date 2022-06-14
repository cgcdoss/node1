import emailController from '../controllers/email';
import http from 'https';
import * as cheerio from 'cheerio';


export class Seduc {
    private _quantidadeAtualEditais = 0;
    private intervals: any[] = [];

    private _verificarMudanças(): void {
        console.log('chamou a verificação da Seduc');

        const options: http.RequestOptions = {
            host: 'www.seduc.pa.gov.br',
            path: `/pagina/11760-pss-001-2022---sectec---seduc---professor-e-tec-nivel-superior`,
            rejectUnauthorized: false,
            method: 'GET'
        };

        const callback = (response: any) => {
            let str = '';
            response.on('data', (chunck: any) => {
                str += chunck;
            });

            response.on('end', () => {
                const $ = cheerio.load(str);
                const quantidadeEditais = $('a[arquivo_download]').length;
                console.log('quantidade: ', quantidadeEditais);

                if (this._quantidadeAtualEditais != quantidadeEditais) {
                    console.log('mudou a resposta');

                    emailController.sendEmail({
                        remetente: 'contato@cassiogabriel.com',
                        destinatario: 'gabi04061997@gmail.com',
                        assunto: `Mudou a quantidade de Editais de ${this._quantidadeAtualEditais} para ${quantidadeEditais}`,
                        // mensagem: `Novo status`,
                        html: str
                    });
                    emailController.sendEmail({
                        remetente: 'contato@cassiogabriel.com',
                        destinatario: 'larissamenezesc08@gmail.com ',
                        assunto: `Mudou a quantidade de Editais de ${this._quantidadeAtualEditais} para ${quantidadeEditais}`,
                        // mensagem: `Novo status`,
                        html: str
                    });
                } else {
                    console.log('mesma resposta');
                }

                this._quantidadeAtualEditais = quantidadeEditais;                
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

    initRastreamento(minutos: number): void {
        this._verificarMudanças(); // Faz a primeira vez para não ficar esperando
        const interval1 = setInterval(() => {
            this._verificarMudanças();
        }, 1000 * 60 * minutos); // a cada x minutos

        const interval2 = setInterval(() => {
            this.autoChamadaHeroku();
        }, 1000 * 60 * 25);

        this.intervals.push(interval1, interval2);
    }

    limparIntervals(): void {
        this.intervals.forEach(i => clearInterval(i));
        this.intervals = [];
        this._quantidadeAtualEditais = 0;
    }
}

export default new Seduc();
