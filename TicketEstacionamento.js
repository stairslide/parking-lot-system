// Importa o map mapClientes declarado na classe Cliente
import { mapClientes } from './Cliente.js';

// Importa mapEmpresas declarado na classe EmpresasMap.js
import { mapEmpresas } from './EmpresasMap.js';

// Importa a classe boleto
import Boleto from './boleto.js';

// Importa a classe desconto
import Desconto from './Desconto.js'

// Cria uma instância de desconto
const desconto = new Desconto(); 

// Cria uma instância de boleto
const boleto = new Boleto();

// Para pedir inputs dos usuários
function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

export default class TicketEstacionamento {

    // Função para calcular valor e gerar ticket dependendo do tipo de cliente
    async GerarTicket(id, rl, placa, tipoCliente){
        const dados = mapClientes.get(placa);
        const tipo = tipoCliente;

        // Segue caso cliente seja avulso
        if (tipo == 'avulso'){

            let saida = new Date(dados.saida);
            let entrada = new Date([...dados.entrada][0]);
        
            const horas = Math.round((saida - entrada) / 1000 / 60 / 60);
            let valor = 0;

            if (horas <= 5){
                console.log("Seu veículo ficou ", horas, " horas no estacionamento.");

                valor = horas * 20;

            }
            else {
                const diaria = 150;
                const d1 = new Date(entrada);
                const d2 = new Date(saida);

                // Normaliza ambas Date para UTC meia-noite
                const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
                const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

                // Diferença em milissegundos
                const diffEmMs = Math.abs(utc2 - utc1);

                // Converte milissegundos para dias:
        
                const diferencaDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

                if (diferencaDias > 0){

                    // a diferença de dias será somada a 1 já que no primeiro dia já será cobrado 
                    valor = diaria * (diferencaDias + 1);

                }
                
                else {
                    valor = diaria
                    console.log("Seu veículo ficou ", horas, " horas no estacionamento. Ultrapassando o limite de 6 horas.");
                    
                }
                    
            }

            const clienteFrequente = desconto.calcularDesconto(dados);
            const valorFinal = valor * (1 - clienteFrequente);

            if (clienteFrequente > 0) {
                console.log(`Você recebeu 20% de desconto! Valor final: R$${valorFinal},00`);
            }

            else{
            console.log(`O valor a ser pago é de R$${valor},00 reais.`);
            }

            console.log("Pagar?");
            console.log("1. Sim");
            console.log("2. Não");
            const escolha = await question(rl, "Escolha (1-2): ");


            if(escolha === "1"){
                console.log("Valor pago.");
                console.log("Saindo do estacionamento...");
                
                // incrementa o registro de saída
                dados.registroSaida++;

                dados.valorUltimaMovimentacao = valorFinal;
                dados.pagou = (escolha === "1");

                
            }
            if (escolha === "2"){
                console.log("Cliente adicionado a lista de bloqueio. Não serão permitidas novas entradas. ");
                dados.dividas = 'bloqueado';
                // incrementa o registro de saída
                dados.registroSaida++;
            }
                                
        }
        if(tipo == 'ESTUDANTE'){
            const saida = new Date(dados.saida);
            let entrada = new Date([...dados.entrada][0]);
            const ingresso = 30;

            const d1 = new Date(entrada);
            const d2 = new Date(saida);

            // Normaliza ambas Date para UTC meia-noite
            const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
            const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

            // Diferença em milissegundos
            const diffEmMs = Math.abs(utc2 - utc1);

            // Converte milissegundos para dias:
    
            const diferencaDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));
            let valor = 0;
            if (diferencaDias > 0){

                // a diferença de dias será somada a 1 já que no primeiro dia já será cobrado 

                valor = ingresso * (diferencaDias + 1);

                console.log(`Seu veículo ficou ${diferencaDias} dia(s) no estacionamento. O ingresso multiplicado pelo número de diárias é de R$${valor},00.`);
            }
            else {
                valor = ingresso;

                console.log(`O ingresso de estudante é de R$${ingresso},00 reais.`);
            }

            console.log("Créditos: ", dados.credito);

            if(dados.credito >= valor){
                console.log("Valor pago.");
                console.log("Saindo do estacionamento...");
                
                // Crédito do aluno é subtraido pelo valor a ser pago
                dados.credito = dados.credito - valor;
                dados.registroSaida++;
                
                dados.valorUltimaMovimentacao = valor;
                dados.pagou = true;
                
            }
            else{
                console.log("Cliente adicionado a lista de bloqueio. Não serão permitidas novas entradas até a inserção de créditos para pagar as dívidas. ");
                dados.credito = valor * -1;

                // Muda dívidas para bloquado
                dados.dividas = 'bloqueado';
                dados.registroSaida++;
            }
        }
        if (tipo == 'PROFESSOR'){
            const saida = new Date(dados.saida);
            let entrada = new Date(dados.entrada);

            const d1 = new Date(entrada);
            const d2 = new Date(saida);

            // Normaliza ambas Date para UTC meia-noite
            const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
            const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

            // Diferença em milissegundos
            const diffEmMs = Math.abs(utc2 - utc1);

            // Converte milissegundos para dias:
    
            const diferencaDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

            // Registra a saída do cliente
            dados.valorUltimaMovimentacao = 0;
            dados.pagou = true;
            dados.registroSaida++;
        }
        if(tipo == 'EMPRESA'){
            const saida = new Date(dados.saida);
            let entrada = new Date([...dados.entrada][0]);
            const ingresso = 30;


            const d1 = new Date(entrada);
            const d2 = new Date(saida);

            // Normaliza ambas Date para UTC meia-noite
            const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
            const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

            // Diferença em milissegundos
            const diffEmMs = Math.abs(utc2 - utc1);

            // Converte milissegundos para dias:
    
            const diferencaDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));
            let valor = 0;
            if (diferencaDias > 0){

                // a diferença de dias será somada a 1 já que no primeiro dia já será cobrado 

                valor = ingresso * (diferencaDias + 1);

                console.log(`Seu veículo ficou ${diferencaDias} dia(s) no estacionamento. A diária multiplicada pelo número de diárias é de R$${valor},00.`);
                console.log("Valor incluído no débito da empresa.");
                }
                
            else {
                valor = ingresso;

                console.log(`A diária é de R$${ingresso},00 reais.`);
                console.log("Valor incluído no débito da empresa.")
            }

            const empresaDados = mapEmpresas.get(id);

            // Soma valor no debito da empresa
            empresaDados.credito += valor;
    
            empresaDados.historicoPagamentos.push({
                valor,
                data: new Date(),
                pago: false,
                placa
            });

            dados.valorUltimaMovimentacao = valor;
            dados.pagou = false;
            
            const hoje = new Date();

            // Verifica se já houve cobrança hoje
            const mesmaData = empresaDados.ultimaCobranca 
                && empresaDados.ultimaCobranca.toDateString() === hoje.toDateString();

            if (!mesmaData) {
                await boleto.EmitirBoletos(placa, rl, id);
            }
            
        }
    }
}