import { Plano } from "../Model";
import { LogRepository } from "../Repository/logRepository";
import { PlanoRepository } from "../Repository/PlanoRepository";

;

export class PlanoService {
    
    // C (CREATE)
    static async criar(usuarioLogadoId: number, data: Omit<Plano, "id">) {
        if (data.preco <= 0) {
            throw new Error("Preço deve ser um valor positivo.");
        }
        
        const id = await PlanoRepository.criar(data);
        await LogRepository.criar(usuarioLogadoId, `Criou novo plano ID: ${id} (${data.nome}).`);
        return id;
    }

    // R (READ - Listar Todos)
    static async listar(): Promise<Plano[]> {
        return PlanoRepository.listarTodos();
    }
    
    // R (READ - Buscar por ID)
    static async buscar(id: number): Promise<Plano | undefined> {
        return PlanoRepository.buscarPorId(id);
    }
    
    // U (UPDATE)
    static async atualizar(usuarioLogadoId: number, id: number, data: Partial<Omit<Plano, "id">>) {
         if (Object.keys(data).length === 0) {
            throw new Error("Nenhum dado para atualizar fornecido.");
        }
        if (data.preco !== undefined && data.preco <= 0) {
            throw new Error("Preço não pode ser negativo ou zero.");
        }
        
        const resultado = await PlanoRepository.atualizar(id, data);
        await LogRepository.criar(usuarioLogadoId, `Atualizou plano ID: ${id}.`);
        return resultado;
    }
    
    // D (DELETE)
    static async deletar(usuarioLogadoId: number, id: number) {
        const resultado = await PlanoRepository.deletar(id);
        await LogRepository.criar(usuarioLogadoId, `Deletou plano ID: ${id}.`);
        return resultado;
    }
}