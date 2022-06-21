class InfoConta {

    private _info!: IInfoConta;

    public processaInformacao(info: IInfoConta): IInfoResp {
        this._info = info;
        const resp = this._getInfoResp();
        this._alterarQuantidadeCasasDecimais(resp, 3);
        return resp;
    }

    private _getInfoResp(): IInfoResp {
        return {
            valorPorKwUltimaFatura: this._valorPorKwUltimaFatura,
            quantidadeKwConsumidosAteOMomento: this._quantidadeKwConsumidosAteOMomento,
            valorGastoAteOMomento: this._valorGastoAteOMomento,
            quantidadeKwGastoPorDia: this._quantidadeKwGastoPorDia,
            quantidadeDiasUltimaLeituraAteProximaLeitura: this._quantidadeDiasUltimaLeituraAteProximaLeitura,
            supostoValorProximaFatura: this._supostoValorProximaFatura,
        };
    }

    private _getDateDiff(data1: Date, data2: Date): number {
        const diffTime = Math.abs(data2.getTime() - data1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    private _alterarQuantidadeCasasDecimais(info: IInfoResp, casasDecimais: number): void {
        let prop: keyof IInfoResp;
        for (prop in info) {
            info[prop] = +info[prop].toFixed(casasDecimais);
        }
    }

    private get _quantidadeKwConsumidosAteOMomento(): number {
        return this._info.quantidadeLeituraAtual - this._info.quantidadeUltimaLeitura;
    }

    private get _valorPorKwUltimaFatura(): number {
        return this._info.valorUltimaFatura / this._info.quantidadeKwUltimaFatura;
    }

    private get _valorGastoAteOMomento(): number {
        return this._quantidadeKwConsumidosAteOMomento * this._valorPorKwUltimaFatura;
    }

    private get _quantidadeKwGastoPorDia(): number {
        let hoje;
        if (this._info.dataRequisicao) { // Caso a data da requisição não venha informada, será considerada a data de hoje
            hoje = new Date(this._info.dataRequisicao);
        } else {
            hoje = new Date();
            hoje.setHours(0, 0, 0);
            hoje.setDate(hoje.getDate() - 1); // para fazer um intervalo aberto
        }

        return this._quantidadeKwConsumidosAteOMomento / this._getDateDiff(new Date(this._info.dataUltimaLeitura), hoje);
    }

    private get _quantidadeDiasUltimaLeituraAteProximaLeitura(): number {
        return this._getDateDiff(new Date(this._info.dataUltimaLeitura), new Date(this._info.dataProximaLeitura))
    }

    private get _supostoValorProximaFatura(): number {
        return this._quantidadeKwGastoPorDia * this._quantidadeDiasUltimaLeituraAteProximaLeitura * this._valorPorKwUltimaFatura;
    }

}

export interface IInfoConta {
    dataRequisicao?: string;
    dataUltimaLeitura: string;
    dataProximaLeitura: string;
    quantidadeUltimaLeitura: number;
    quantidadeLeituraAtual: number;
    valorUltimaFatura: number;
    quantidadeKwUltimaFatura: number;
}

export interface IInfoResp {
    quantidadeKwConsumidosAteOMomento: number;
    valorPorKwUltimaFatura: number;
    valorGastoAteOMomento: number;
    quantidadeKwGastoPorDia: number;
    quantidadeDiasUltimaLeituraAteProximaLeitura: number;
    supostoValorProximaFatura: number;
}

export default new InfoConta();
