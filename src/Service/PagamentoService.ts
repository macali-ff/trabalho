import { Pagamento } from "../Model";
import { LogRepository } from "../Repository/logRepository";
import { PagamentoRepository } from "../Repository/Pagamentorepository";

export class PagamentoService {
    
    // C (CREATE)
    static async criar(usuarioLogadoId: number, data: Omit<Pagamento, "id" | "dataCriacao">) {
        if (data.total <= 0) {
            throw new Error("O valor total do pagamento deve ser positivo.");
        }
        if (data.itens.length === 0) {
             throw new Error("O pagamento deve conter pelo menos um item.");
        }
        
        // CORREÇÃO: Não fazemos mais JSON.stringify aqui.
        // O Repository agora espera o array de objetos normal.
        const id = await PagamentoRepository.criar(data);

        await LogRepository.criar(usuarioLogadoId, `Registrou pagamento ID: ${id} (R$${data.total}).`);
        return id;
    }

    // R (READ - Listar Todos)
   static async listar(): Promise<Pagamento[]> {
        // CORREÇÃO: O Repository já entrega o objeto pronto (parseado).
        // Não precisamos fazer map nem parse aqui.
        return PagamentoRepository.listarTodos(); 
    }
    
    // R (READ - Buscar por ID)
    static async buscar(id: number): Promise<Pagamento | undefined> {
        // O Repository já retorna null ou o objeto correto.
        const pagamento = await PagamentoRepository.buscarPorId(id);
        return pagamento || undefined;
    };
    
    // U (UPDATE)
    static async atualizar(usuarioLogadoId: number, id: number, data: Partial<Omit<Pagamento, "id" | "dataCriacao">>) {
        if (Object.keys(data).length === 0) {
            throw new Error("Nenhum dado para atualizar fornecido.");
        }

        // CORREÇÃO: Passamos os dados direto. Se tiver 'itens', o Repository cuida de transformar em string.
        const resultado = await PagamentoRepository.atualizar(id, data);
        
        await LogRepository.criar(usuarioLogadoId, `Atualizou registro de pagamento ID: ${id}.`);
        return resultado;
    }
    
    // D (DELETE)
    static async deletar(usuarioLogadoId: number, id: number) {
        const resultado = await PagamentoRepository.deletar(id);
        await LogRepository.criar(usuarioLogadoId, `DELETOU pagamento ID: ${id}.`); 
        return resultado;
    }
}