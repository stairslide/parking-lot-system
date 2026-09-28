// Importa o map mapClientes declarado na classe Cliente
import { mapClientes } from './Cliente.js';

import TicketEstacionamento from './TicketEstacionamento.js';

const ticket = new TicketEstacionamento();

import fs from 'fs';

export default class RegistroDeEntradasESaidas {
    // Função para carros entrarem no estacionamento
    Entradas(placa, numid, tipoCliente){

        // Se mapClientes já não haver dados referentes a placa, irá definir os dados referentes a placa no map
        if (!mapClientes.has(placa)) {
            mapClientes.set(placa, {
                    id: new Set([numid]),
                    tipoCliente: tipoCliente,

                    // A entrada é inicializada com o horário atual

                    // entrada: new Set([new Date().toISOString()]),
                    entrada: new Set(),
                    
                    // saida é inicializada como null na entrada do veículo
                    saida: null,

                    // Todo cliente entra pela primeira vez no estacionamento sem dividas

                    dividas: null,

                    // os contadores de registros serão inicializado em 0
                    
                    registroEntrada: 0,

                    registroSaida: 0,

                    // Map para registrar cada entrada com a data
                    historicoEntradas: new Map(),

                    // credito especifico para alunos pagarem ticket
                    credito: 0 

            });

        }

        const dados = mapClientes.get(placa);

        dados.entrada.add(new Date().toISOString());
        
        console.log("Dados da placa: ", placa);

        // Registro de entrada
        dados.registroEntrada++;

        // Data de hoje
        const hoje = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Marca a data da entrada no historico
        if (dados.historicoEntradas.has(hoje)) {
            dados.historicoEntradas.set(hoje, dados.historicoEntradas.get(hoje) + 1);
        } else {
            dados.historicoEntradas.set(hoje, 1);
        }

        console.log(dados);
        return mapClientes;
    }

    // Manda gerar ticket para a saída do carro
    async Saidas(numid, rl, placa, tipoCliente){
        const dados = mapClientes.get(placa);
        dados.saida = new Date().toISOString();

        await ticket.GerarTicket(numid, rl, placa, tipoCliente);

        this.salvarMovimentacaoCSV(placa, dados);

        return "Saindo do estacionamento...";
    }



    salvarMovimentacaoCSV(placa, dados, caminho = './movimentacoes.csv') {

        const id = [...dados.id][0];
        const tipo = dados.tipoCliente;

        const entrada = [...dados.entrada].pop();
        const saida = dados.saida;

        const valor = dados.valorUltimaMovimentacao || 0;
        const pago = dados.pagou ? 'true' : 'false';

        if (entrada && saida) {
            const linha = `${placa},${id},${tipo},${entrada},${saida},${valor},${pago}\n`;
            fs.appendFileSync(caminho, linha, 'utf-8');
            console.log("Movimentação salva!");
        } else {
            console.log("Nada para salvar.");
        }
    }
}