import { Cliente } from "../Model";
import { ClienteRepository } from "../Repository/ClienteRepository";
import { LogRepository } from "../Repository/logRepository";

export class ClienteService {
    
    // C (CREATE)
    static async criar(clienteLogadoId: number, data: Omit<Cliente, "id" | "dataMatricula">) {
        // Validação básica de CPF
        if (data.cpf && data.cpf.length !== 11) {
            throw new Error("O CPF deve ter exatamente 11 dígitos (apenas números).");
        }

        // Gera a data de matrícula
        const dataAtual = new Date().toISOString().split('T')[0];
        
        const dadosCompletos: Omit<Cliente, "id"> = {
            ...data,
            dataMatricula: dataAtual 
        };

        const id = await ClienteRepository.criar(dadosCompletos);
    
        await LogRepository.criar(clienteLogadoId, `Cadastrou novo cliente ID: ${id} (${data.nome}).`);
        return id;
    }

    // R (READ - Listar Todos)
    static async listar(): Promise<Cliente[]> {
        return ClienteRepository.listarTodos();
    }
    
    // R (READ - Buscar por ID)
    static async buscar(id: number): Promise<Cliente | undefined> {
        return ClienteRepository.buscarPorId(id);
    }
    
    // U (UPDATE)
    static async atualizar(usuarioLogadoId: number, id: number, data: Partial<Omit<Cliente, "id" | "dataMatricula">>) {
        if (Object.keys(data).length === 0) {
            throw new Error("Nenhum dado para atualizar fornecido.");
        }
        
        const resultado = await ClienteRepository.atualizar(id, data);
        await LogRepository.criar(usuarioLogadoId, `Atualizou cliente ID: ${id}.`);
        return resultado;
    }
    
    // D (DELETE)
    static async deletar(usuarioLogadoId: number, id: number) {
        const resultado = await ClienteRepository.deletar(id);
        await LogRepository.criar(usuarioLogadoId, `Deletou cliente ID: ${id}.`);
        return resultado;
    }
}