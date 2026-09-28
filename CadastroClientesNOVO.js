import { mapClientes } from './Cliente.js';

export default class CadastroClientesNOVO {

    // Cadastro manual ou via CSV
    cadastrarCliente(placa, numid, tipoCliente, nome, credito = 0) {

        if (!mapClientes.has(placa)) {

            mapClientes.set(placa, { 
                id: new Set([numid]),
                tipoCliente: tipoCliente,
                nome: nome,

                entrada: new Set(), 
                saida: null,

                dividas: null,

                registroEntrada: 0,
                registroSaida: 0,

                historicoEntradas: new Map(),

                credito: credito
            });

            console.log("Cliente cadastrado com sucesso!");
            return true;

        } else {
            console.log("Cadastro já existe! Atualizando dados...");

            const dados = mapClientes.get(placa);

            dados.id.add(numid);
            dados.tipoClienteSet.add(tipoCliente);

            return false;
        }
    }


    // Carregar dados de arquivo CSV
    async carregarDeCSV(caminhoArquivo) {

        const fs = await import('fs');
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');

        const linhas = conteudo
            .split(/\r?\n/)
            .filter(l => l.trim().length > 0);

        for (const linha of linhas) {

            const cols = linha.split(',').map(s => s.trim());

            const campo2 = cols[2] || '';
            const ehNumero = !isNaN(Number(campo2));

            if (ehNumero && cols.length >= 5) {

                // ESTUDANTE
                const [cpf, nome, creditosStr, tipo, placa] = cols;

                if (tipo.toUpperCase() === 'ESTUDANTE') {

                    const creditos = Number(creditosStr);

                    this.cadastrarCliente(
                        placa,
                        cpf,
                        'ESTUDANTE',
                        nome,
                        !Number.isNaN(creditos) ? creditos : 0
                    );

                } else {
                    // EMPRESA
                    const [cnpj, nome, saldoStr, tipoEmp, ...placas] = cols;

                    for (const placa of placas) {
                        if (placa) {
                            this.cadastrarCliente(
                                placa,
                                cnpj,
                                'EMPRESA',
                                nome
                            );
                        }
                    }
                }

            } else if (campo2.toUpperCase() === 'PROFESSOR') {

                // PROFESSOR
                const [cpf, nome, tipo, ...placas] = cols;

                for (const placa of placas) {
                    if (placa) {
                        this.cadastrarCliente(
                            placa,
                            cpf,
                            'PROFESSOR',
                            nome
                        );
                    }
                }

            } else {
                console.warn('Linha ignorada:', linha);
            }
        }

        return mapClientes.size;
    }
}