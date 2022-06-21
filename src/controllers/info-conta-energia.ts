
class InfoConta {

    private _info!: IInfoConta;
    public infoResp!: Partial<IInfoResp>;

    public setInfo(info: IInfoConta): void {
        this._info = info;
        this._setValores();
    }

    private _setValores(): void {
        this.infoResp = {
            valorPorKwUltimaFatura: +this._valorPorKwUltimaFatura.toFixed(3),
            quantidadeKwConsumidosAteOMomento: +this._quantidadeKwConsumidos.toFixed(3),
            valorGastoAteOMomento: +this._valorGastoAteMomento.toFixed(3),
            quantidadeKwGastoPorDia: +this._quantidadeKwGastoPorDia.toFixed(3),
            quantidadeDiasUltimaLeituraAteProximaLeitura: +this._quantidadeDiasUltimaLeituraAteProximaLeitura.toFixed(3),
            supostoValorProximaFatura: +this._supostoValorProximaFatura.toFixed(3),
        };
    }

    private get _quantidadeKwConsumidos(): number {
        return this._info.quantidadeLeituraAtual - this._info.quantidadeUltimaLeitura;
    }

    private get _valorPorKwUltimaFatura(): number {
        return this._info.valorUltimaFatura / this._info.quantidadeKwUltimaFatura;
    }

    private get _valorGastoAteMomento(): number {
        return this._quantidadeKwConsumidos * this._valorPorKwUltimaFatura;
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

        return this._quantidadeKwConsumidos / this._getDateDiff(new Date(this._info.dataUltimaLeitura), hoje);
    }

    private get _quantidadeDiasUltimaLeituraAteProximaLeitura(): number {
        return this._getDateDiff(new Date(this._info.dataUltimaLeitura), new Date(this._info.dataProximaLeitura))
    }

    private get _supostoValorProximaFatura(): number {
        return this._quantidadeKwGastoPorDia * this._quantidadeDiasUltimaLeituraAteProximaLeitura * this._valorPorKwUltimaFatura;
    }

    private _getDateDiff(data1: Date, data2: Date): number {
        const diffTime = Math.abs(data2.getTime() - data1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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
