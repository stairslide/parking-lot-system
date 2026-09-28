export default class Desconto {
    calcularDesconto(dados) {

        // horário de hoje
        const hoje = new Date();
        let entradasUltimos5Dias = 0;

        for (let [dataStr, count] of dados.historicoEntradas) {
            const data = new Date(dataStr);

            // Horário convertido para dias
            const diffDias = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));

            // Se a diferença ente dias for menor que 5, somar com o número de entradas na iteração em historicoEntradas
            if (diffDias <= 5) {
                entradasUltimos5Dias += count;
            }
        }

        if (entradasUltimos5Dias >= 3) {
            return 0.2; // 20% de desconto
        }
        return 0;
    }
}