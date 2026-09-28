// Importa o map mapClientes declarado na classe Cliente
import { mapClientes } from './Cliente.js';

import Registros from './RegistroDeEntradas_E_Saidas.js';

const registros = new Registros();

function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

export default class Avulso {
    async AutorizarAvulso(rl, tipoCliente, placa) {
        const dados = mapClientes.get(placa);


        // O ? antes do .has é um optional chaining, que evita erros se a string dividas não existir no map
        if (dados?.dividas === ('bloqueado')){
            console.log("Entrada Bloquada.");
            return;
        }

        // Se o número de entradas for maior que o de saídas, o carro está no estacionamento
        if (dados?.registroEntrada > dados?.registroSaida){

        console.log("Carro já está no estacionamento.");
        const id = 'avulso';
        const retorno = await this.SaidaCarro(id, rl, placa, tipoCliente);
        
        }
        else {
            // Declara id como avulso já que não possui cpf
            const id = 'avulso';
            registros.Entradas(placa, id, tipoCliente);

        }
    }

    async SaidaCarro(id, rl, placa, tipoCliente) {
        console.log("O que deseja fazer?");
        console.log("1. Sair do estacionamento");
        const escolha = await question(rl, "2. Voltar ao menu \n");

        switch(escolha){
            case "1":
                const numid = 'avulso';
                await registros.Saidas(id, rl, placa, tipoCliente);
                break;
            case "2":
                return "Voltando ao menu...";
        }
    }
}
