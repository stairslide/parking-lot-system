// Importa o map mapClientes declarado na classe Cliente
import { mapClientes } from './Cliente.js';

import Registros from './RegistroDeEntradas_E_Saidas.js';

const registros = new Registros();

function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

export default class Aluno {


    // 'async' permite que o código espere pelo input do usuário e depois retome execução

    async AutorizarAluno(rl, tipoCliente, placa) {
        const cpf = await question(rl, "Insira o seu CPF: ");
        console.log(cpf);

        // dados se refere aos dados do cliente com a placa correspondente

        const dados = mapClientes.get(placa);

       

        // O ? antes do .has é um optional chaining, que evita erros se a string dividas não existir no map

        if (dados?.dividas === ('bloqueado')){
            console.log("Entrada Bloqueada.");
            console.log("créditos: ", dados.credito);
            console.log("Você precisa pagar", dados.credito * -1,"para entrar no estacionamento.");

            console.log("Depositar crédito?");
            console.log("1. Sim");
            console.log("2. Não");
            const escolha = await question(rl, "Escolha (1-2): ");


            if(escolha === "1"){
                let negativo = true;
                    while(negativo){
                    const deposito = await question(rl, "Escolha a quantia: ");
                    if (deposito < dados.credito * -1){
                        console.log("Valor menor que a dívida.")
                    }
                    else{
                        dados.credito = deposito - dados.credito * -1;
                        console.log("Valor pago.");
                        console.log("Saindo do estacionamento...");
                        
                        dados.dividas = null;
                        negativo = false;
                    }
                }
                
                
                // incrementa o registro de saída
                dados.registroSaida++;

                
            }
        }

         // Se a placa haver mais entradas que saídas, é por que o carro está dentro do estacionamento
        if (dados?.registroEntrada > dados?.registroSaida){

            console.log("Carro já está no estacionamento.");
            const retorno = await this.SaidaCarro(cpf, rl, placa, tipoCliente);
            
        }

        // Se não estiver no estacionamento, a entrada será possível
        else{
            registros.Entradas(placa, cpf, tipoCliente);
        }
    }

    // Função para aluno sair com o carro do estacionamento
    async SaidaCarro(cpf, rl, placa, tipoCliente) {
        console.log("O que deseja fazer?");
        console.log("1. Sair do estacionamento");
        const escolha = await question(rl, "2. Voltar ao menu \n");

        switch(escolha){
            case "1":
                await registros.Saidas(cpf, rl, placa, tipoCliente);
                break;
            case "2":
                return "Voltando ao menu...";
        }
    }
}