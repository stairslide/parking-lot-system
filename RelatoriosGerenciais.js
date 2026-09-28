import fs from 'fs';
import { mapClientes } from './Cliente.js';

export default class RelatoriosGerenciais {

    // Lê o CSV movimentações e transforma colunas em variáveis
    lerMovimentacoes(caminho = './movimentacoes.csv') {
        if (!fs.existsSync(caminho)) return [];

        const conteudo = fs.readFileSync(caminho, 'utf-8');

        return conteudo
            .split('\n')
            .filter(l => l.trim() !== '')
            .map(linha => {
                const [placa, id, tipo, entrada, saida, valor, pago] = linha.split(',');


                return {
                    placa,
                    id,
                    tipo,
                    entrada: new Date(entrada),
                    saida: new Date(saida),
                    valor: Number(valor),
                    pago: pago === 'true'
                };
            });
    }

    // Valor total arrecadado por data de ínicio e fim
    valorTotalArrecadado(inicio, fim) {

        const dados = this.lerMovimentacoes();

        let total = 0;

        for (const mov of dados) {

            if (
                mov.saida >= inicio &&
                mov.saida <= fim &&
                mov.pago === true &&
                (!tipoFiltro || mov.tipo === tipoFiltro)
            ) {
                total += mov.valor;
            }
        }

        return total;
    }

    // Vê váriaveis da placa se ela já tiver sido cadastrado ou registrada no estacionamento
    situacaoCliente(placa) {

        if (!mapClientes.has(placa)) {
            return "Cliente não encontrado.";
        }

        const dados = mapClientes.get(placa);

        return {
            placa,
            tipo: dados.tipoCliente,
            dividas: dados.dividas,
            credito: dados.credito,
            entradas: dados.registroEntrada,
            saidas: dados.registroSaida
        };
    }

    // Registros de clientes cadastrados 
    registrosClientesPorPeriodo(inicio, fim) {

        const dados = this.lerMovimentacoes();

        return dados.filter(mov => 
            mapClientes.has(mov.placa) &&
            mov.entrada >= inicio &&
            mov.saida <= fim
        );
    }

    // Registros de clientes avulsos
    registrosNaoCadastrados(inicio, fim) {

        const dados = this.lerMovimentacoes();

        return dados.filter(mov => 
            mapClientes.has(mov.placa) &&
            mov.tipo ==='avulso' &&
            mov.entrada >= inicio &&
            mov.saida <= fim
        );
    }

    // Vê clientes que estão bloquados no momento
    clientesBloqueados() {

        const bloqueados = [];

        for (const [placa, dados] of mapClientes) {
            if (dados.dividas === 'bloqueado') {
                bloqueados.push(placa);
            }
        }

        return bloqueados;
    }

    top10ClientesFrequentes() {

        const dados = this.lerMovimentacoes();
        const contagem = {};
        
        for (const mov of dados) {
            contagem[mov.placa] = (contagem[mov.placa] || 0) + 1;
        }

        return Object.entries(contagem)
            .map(([placa, total]) => ({ placa, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
    }
}