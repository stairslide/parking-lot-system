// Importa biblioteca para ler input do usuário
import readline from 'readline'

// Importa classe Professor
import Professor from './Professor.js';

import Cliente from './Cliente.js'

import RelatoriosGerenciais from './RelatoriosGerenciais.js';


// import CadastroClientes from './CadastroClientes.js';

// const cadastroClientes = new CadastroClientes();

//FASE 2 - CSV

// Importa as bibliotecas que permitem ler arquivos csv
import fs from 'fs';
import csv from 'csv-parser';
import CadastroClientesNOVO from './CadastroClientesNOVO.js';

import { salvarParaCSV } from './SalvarCsv.js';

const cadastroClientesNOVO = new CadastroClientesNOVO();

const relatorios = new RelatoriosGerenciais();


// Cria array para guardar as linhas do csv como objetos
const results = [];


await cadastroClientesNOVO.carregarDeCSV('./cadastros.csv');
// console.log("Clientes carregados!");

// Cria uma instância de Professor
const professor = new Professor();

// Cria uma instância de Cliente
const cliente = new Cliente();

// Para pedir inputs ao usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

  let rodando = true;

class App {

  async coletarDadosCliente(tipo) {

    const nome = await question("Digite o nome: ");
    const documento = await question("Digite o CPF/CNPJ: ");

    let placa;

      placa = await question("Digite a placa (ABC1D23): ");

    let credito = 0;


    return {
      nome,
      documento,
      placa,
      credito
    };
}

  async PreCadastro(){

    // Menu para usuário

    console.log("Escolha uma opção: ");
    console.log("1 - Entrar no estacionamento: ");
    console.log("Escolha uma opção: ");
    while (rodando){

      console.log("Possui Cadastro?");
      console.log("1. Sim");
      console.log("2. Entrar sem Cadastro (Cliente Avulso)");
      console.log("3. Criar cadastro");
      console.log("4. Sair");
      console.log("5. Relatórios Gerenciais");

      const cadastro = await question("Escolha (1-5): ");

      // Segue caso usuário possua cadastro
      if (cadastro === "1") {
        console.log("Insira uma das opções:");
        console.log("1. Empresa");
        console.log("2. Aluno");
        console.log("3. Professor");

        // await espera usuário inserir dados antes de continuar a execução do programa
        const resposta = await question("Escolha (1-3): ");
        const resultado = await cliente.TipoCliente(resposta, cadastro, rl);
        console.log(resultado);

      }

      // Segue caso usuário seja cliente avulso
      if (cadastro == '2'){
        console.log("Cliente Avulso");
        const resposta = "avulso";
        const cadastro = 'avulso'
        const resultado = await cliente.TipoCliente(resposta, cadastro, rl);
        console.log(resultado);

      } 

      // Cadastrar usuário
      if (cadastro === '3'){
        console.log("Insira uma das opções:");
        console.log("1. Empresa");
        console.log("2. Aluno");
        console.log("3. Professor");

        // await espera usuário inserir dados antes de continuar a execução do programa
        const resposta = await question("Escolha (1-3): ");

        const dados = await this.coletarDadosCliente(resposta);

        let tipoCliente = "";

        if (resposta === "1") tipoCliente = "EMPRESA";
        if (resposta === "2") tipoCliente = "ESTUDANTE";
        if (resposta === "3") tipoCliente = "PROFESSOR";

        // Chama cadastro
        cadastroClientesNOVO.cadastrarCliente(
          dados.placa,
          dados.documento,
          tipoCliente,
          dados.nome,
          dados.credito
        );
  
    
        console.log("Cadastro realizado com sucesso!");
      }

      if (cadastro == '4'){
        rodando = false;

        salvarParaCSV('./cadastros.csv');

        console.log("Saindo do programa.");

      }
      
      if (cadastro === '5') {

        console.log("Relatórios Gerenciais:");
        console.log("1. Valor total arrecadado");
        console.log("2. Situação de cliente");
        console.log("3. Registros de clientes cadastrados");
        console.log("4. Registros de não cadastrados");
        console.log("5. Clientes bloqueados");
        console.log("6. Top 10 clientes");
        console.log("7. Voltar");

        const opcao = await question("Escolha (1-7): ");

        switch(opcao) {

          case "1":
            // Datas no formato YYYY-MM-DD
            const inicioStr = await question("Data início (YYYY-MM-DD): ");
            const fimStr = await question("Data fim (YYYY-MM-DD): ");

            const inicio = new Date(inicioStr);
            const fim = new Date(fimStr);

            const total = relatorios.valorTotalArrecadado(inicio, fim);
            console.log("Total arrecadado: R$", total);
            break;

          case "2":
            const placa = await question("Digite a placa: ");
            console.log(relatorios.situacaoCliente(placa));
            break;

          case "3":
            const ini1 = new Date(await question("Data início (YYYY-MM-DD): "));
            const fim1 = new Date(await question("Data fim (YYYY-MM-DD): "));
            console.log(relatorios.registrosClientesPorPeriodo(ini1, fim1));
            break;

          case "4":
            const ini2 = new Date(await question("Data início (YYYY-MM-DD): "));
            const fim2 = new Date(await question("Data fim (YYYY-MM-DD): "));
            console.log(relatorios.registrosNaoCadastrados(ini2, fim2));
            break;

          case "5":
            console.log(relatorios.clientesBloqueados());
            break;

          case "6":
            console.log(relatorios.top10ClientesFrequentes());
            break;

          case "7":
            break;

          default:
            console.log("Opção inválida.");
        }
      }
    }


    rl.close();
  }
}

// Chama a função PreCadastro da própria classe
const app = new App();

app.PreCadastro();


