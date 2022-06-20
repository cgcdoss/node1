
class InfoConta {

    private _info!: IInfoConta;
    public infoResp!: Partial<IInfoResp>;

    public setInfo(info: IInfoConta): void {
        this._info = info;
        this._setValores();
    }

    private _setValores(): void {
        this.infoResp = {
            valorPorKwUltimaFatura: this._valorPorKwUltimaFatura,
            quantidadeKwConsumidosAteOMomento: this._quantidadeKwConsumidos,
            valorGastoAteOMomento: this._valorGastoAteMomento,
            quantidadeKwGastoPorDia: this._quantidadeKwGastoPorDia,
            quantidadeDiasUltimaLeituraAteProximaLeitura: this._quantidadeDiasUltimaLeituraAteProximaLeitura,
            supostoValorProximaFatura: this._supostoValorProximaFatura,
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
        // Por ser intervalo aberto tem que subtrair um
        return this._quantidadeKwConsumidos / (this._getDateDiff(new Date(this._info.dataUltimaLeitura), new Date()) - 1);
    }

    private get _quantidadeDiasUltimaLeituraAteProximaLeitura(): number {
        return this._getDateDiff(new Date(this._info.dataUltimaLeitura), new Date(this._info.dataProximaLeitura))
    }

    private get _supostoValorProximaFatura(): number {
        return this._quantidadeKwGastoPorDia * this._quantidadeDiasUltimaLeituraAteProximaLeitura * this._valorPorKwUltimaFatura;
    }

    private _getDateDiff(data1: Date, data2: Date): number {
        const date1 = new Date(data1);
        const date2 = new Date(data2);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

}

export interface IInfoConta {
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
