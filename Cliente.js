import Empresa from './Empresa.js';
import Professor from './Professor.js';
import Aluno from './Aluno.js';
import Avulso from './Avulso.js';

// Cria map que armazena dados dos clientes
const mapClientes = new Map();

// Exporta o map para as classes que precisarem importar
export { mapClientes };

export default class Cliente {

    // Função para autorizar a entrada de clientes de acordo com o tipo de cliente
    // rl passado de App.js para evitar erros no terminal
    
    async TipoCliente(resposta, cadastro, rl){

        // Declara tipoCliente como null para manter escopo visível 
        let tipoCliente = null;

        // Prosseguir caso já haja cadastro
        if (cadastro === "1"){

            const placa = await new Promise(resolve =>
            rl.question("Digite a placa: ", resolve)
            );

            // Não permite entrada para usuários cadastrados caso não haja cadastro
            if (!mapClientes.has(placa)) {
                console.log("Cadastro não encontrado. Entre como avulso ou cadastre-se.");
                return;
            }

                switch (resposta) {
                    case "1":
                        tipoCliente = "EMPRESA"; 
                        return new Empresa().AutorizarEmpresa(rl, tipoCliente, placa);

                    case "2":
                        tipoCliente = "ESTUDANTE"; 
                        return new Aluno().AutorizarAluno(rl, tipoCliente, placa);

                    case "3":
                        tipoCliente = "PROFESSOR"; 
                        return new Professor().AutorizarProfessor(rl, tipoCliente, placa);

                    default:
                        // Volta o loop
                        return "Número inválido.";
                }
        }

        // Segue caso cliente seja avulso
        if(resposta === 'avulso'){
             const placa = await new Promise(resolve =>
            rl.question("Digite a placa: ", resolve)
            );
            tipoCliente = "avulso"; 
            return new Avulso().AutorizarAvulso(rl, tipoCliente, placa);
        }
    }

}



