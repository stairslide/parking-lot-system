import { mapEmpresas } from './EmpresasMap.js';
import { mapClientes } from './Cliente.js';

import fs from 'fs';

function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}


export default class boleto {

    async EmitirBoletos(placa, rl, id) {

        const empresaDados = mapEmpresas.get(id);
        const hoje = new Date();

        console.log(`Emitindo boleto para CNPJ ${id}. Valor acumulado: R$${empresaDados.credito}`);
        empresaDados.ultimaCobranca = hoje;

        console.log("Pagar?");
        console.log("1. Sim");
        console.log("2. Não");
        const escolha = await question(rl, "Escolha (1-2): ");


        if(escolha === "1"){

            const valorPago = empresaDados.credito;

            console.log("Valor pago.");
            console.log("Saindo do estacionamento...");
            
            // Marca todos as cobranças como pagas ao pagar o boleto
            for (const pagamento of empresaDados.historicoPagamentos) {
                if (!pagamento.pago) {
                    pagamento.pago = true;
                }
            }


            const dados = mapClientes.get(placa);

            // Zera dívidas
            empresaDados.credito = 0;

            // Tira o status de inadimplente da empresa
            empresaDados.status = null;
            dados.registroSaida++;

            const linhaPagamento = `${placa},${id},EMPRESA,PAGAMENTO,${new Date().toISOString()},${valorPago},true\n`;

            fs.appendFileSync('./movimentacoes.csv', linhaPagamento, 'utf-8');

            
        }
        if (escolha === "2"){
            console.log("Empresa adicionada a lista de bloqueio. Não serão permitidas novas entradas até o pagamento da fatura. ");
            

            empresaDados = mapEmpresas.get(id);

            empresaDados.status = "bloqueado";

            console.log(empresaDados);

        }
    }
}