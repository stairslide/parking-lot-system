// Importa o map mapClientes declarado na classe Cliente
import { mapClientes } from './Cliente.js';

// Importa a classe Registros
import Registros from './RegistroDeEntradas_E_Saidas.js';

// Cria nova instância de Registros
const registros = new Registros();

function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

export default class Professor {
    async AutorizarProfessor(rl, tipoCliente, placa) {
        const cpf = await question(rl, "Insira o seu CPF: ");
        console.log(cpf);


        const dados = mapClientes.get(placa);

        // O ? antes do .has é um optional chaining, que evita erros se a string dividas não existir no map
        if (dados?.dividas === ('bloqueado')){
            console.log("Entrada Bloquada.");
            return;
        }
        if (dados?.registroEntrada > dados?.registroSaida){
           
            console.log("Carro já está no estacionamento.");
            const retorno = await this.SaidaCarro(cpf, rl, placa, tipoCliente);
            
        }
        else{
            registros.Entradas(placa, cpf, tipoCliente);
        }
    }
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
