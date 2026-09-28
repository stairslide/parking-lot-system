// Importa o map mapClientes declarado na classe Cliente
import { mapClientes } from './Cliente.js';

import Registros from './RegistroDeEntradas_E_Saidas.js';

import Boleto from './boleto.js';

const boleto = new Boleto();

import { mapEmpresas } from './EmpresasMap.js';

const registros = new Registros();

function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

export default class Empresa {
    async AutorizarEmpresa(rl, tipoCliente, placa) {
        const cnpj = await question(rl, "Insira o CNPJ de sua Empresa: ");
       
        // Dados do cliente com a placa inserida
        const dados = mapClientes.get(placa);


        // Popula dados no map caso ainda não exista dados referentes a placa
        if (!mapEmpresas.has(cnpj)) {
        mapEmpresas.set(cnpj, {
            status: null,
            credito: 0,
            historicoPagamentos: [],
            ultimaCobranca: null
        });
    }
        const empresaDados = mapEmpresas.get(cnpj);

        // Bloqueia carros de empresas bloqueadas

        if (dados?.dividas === ('bloqueado')){
            console.log("Entrada Bloquada.");
            return;
        }

        if (empresaDados.status === "bloqueado") {
        console.log("Entrada bloqueada para esta empresa.");
        await boleto.EmitirBoletos(placa, rl, cnpj);

        return;
        }

         // O ? antes do . é um optional chaining, usado para evitar problemas se os registros de entrada e de saídas não tivessem sidos definidos ainda

        if (dados?.registroEntrada > dados?.registroSaida){

           
            console.log("Carro já está no estacionamento.");
            const retorno = await this.SaidaCarro(rl, cnpj, placa, tipoCliente);
           
        }
        else {
                   
            registros.Entradas(placa, cnpj, tipoCliente);

        }
    }

     async SaidaCarro(rl, numid, placa, tipoCliente) {
        console.log("O que deseja fazer?");
        console.log("1. Sair do estacionamento");
        const escolha = await question(rl, "2. Voltar ao menu \n");

        switch(escolha){
            case "1":
                await registros.Saidas(numid, rl, placa, tipoCliente);
                break;
            case "2":
                return "Voltando ao menu...";
        }
    }

}