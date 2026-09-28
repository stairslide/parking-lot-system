import { mapClientes } from './Cliente.js';

// Para escrever no csv
import fs from 'fs';

// Chamada ao fechar a execução do código
export function salvarParaCSV(caminhoArquivo = './cadastros.csv') {

    const linhas = [];

    for (const [placa, dados] of mapClientes) {

        const id = [...dados.id][0];
        const tipo = dados.tipoCliente;
        const nome = dados.nome || "Sem Nome";
        const credito = dados.credito || 0;

        if (tipo === 'ESTUDANTE') {

            linhas.push(
                `${id},${nome},${credito},ESTUDANTE,${placa}`
            );

        } else if (tipo === 'PROFESSOR') {

            linhas.push(
                `${id},${nome},PROFESSOR,${placa}`
            );

        } else if (tipo === 'EMPRESA') {

            linhas.push(
                `${id},${nome},${credito},EMPRESA,${placa}`
            );
        }
    }

    const conteudo = linhas.join('\n');

    if (linhas.length === 0) {
        console.log("Nenhum dado para salvar. CSV não foi alterado.");
        return;
    }
    // Salva em cadastros.csv
    fs.appendFileSync(caminhoArquivo, conteudo, 'utf-8');

    console.log("CSV salvo com sucesso!");
}