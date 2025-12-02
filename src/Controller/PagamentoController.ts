import { Pagamento } from "../Model";
import { PagamentoService } from "../Service/PagamentoService"; 

export class PagamentoController {

    // C (CREATE)
    static async cadastrar(clienteLogadoId: number, data: Omit<Pagamento, "id" | "dataCriacao">) {
        try {
            const id = await PagamentoService.criar(clienteLogadoId, data);
            console.log(`✅ Pagamento registrado com sucesso! ID: ${id}`);
        } catch (error: any) {
            console.error(`❌ Erro ao registrar pagamento: ${error.message}`);
        }
    }

    // R (READ - Listar Todos com Cliente)
    static async listar() {
        try {
            const lista = await PagamentoService.listar();
            console.log("\n=== HISTÓRICO DE PAGAMENTOS ===");
            console.table(lista);
        } catch (error: any) {
            console.error(`❌ Erro ao listar pagamentos: ${error.message}`);
        }
    }
    
    // R (READ - Buscar por ID)
    static async buscar(id: number) {
        try {
            const pagamento = await PagamentoService.buscar(id);
            if (pagamento) {
                console.log(`\n=== DADOS DO PAGAMENTO ID ${id} ===`);
                console.table([pagamento]);
                // Mostrar itens separadamente (pois a tabela pode ficar ruim)
                if (pagamento.itens && pagamento.itens.length > 0) {
                    console.log("\n--- ITENS COMPRADOS ---");
                    console.table(pagamento.itens);
                }
            } else {
                console.log(`⚠️ Pagamento ID ${id} não encontrado.`);
            }
        } catch (error: any) {
            console.error(`❌ Erro ao buscar pagamento: ${error.message}`);
        }
    }

    // U (UPDATE)
    static async atualizar(usuarioLogadoId: number, id: number, data: Partial<Omit<Pagamento, "id" | "dataCriacao">>) {
        try {
            const changesRaw = await PagamentoService.atualizar(usuarioLogadoId, id, data);
             const changes = changesRaw ?? 0; 
            if (changes > 0) {
                console.log(`✅ Pagamento ID ${id} atualizado com sucesso. (${changes} campo(s) alterado(s))`);
            } else {
                console.log(`⚠️ Pagamento ID ${id} não encontrado ou nenhum dado novo fornecido.`);
            }
        } catch (error: any) {
            console.error(`❌ Erro ao atualizar pagamento: ${error.message}`);
        }
    }
    
    // D (DELETE)
    static async deletar(usuarioLogadoId: number, id: number) {
        try {
            const changesRaw = await PagamentoService.deletar(usuarioLogadoId, id);
             const changes = changesRaw ?? 0; 
            if (changes > 0) {
                console.log(`✅ Pagamento ID ${id} deletado com sucesso.`);
            } else {
                console.log(`⚠️ Pagamento ID ${id} não encontrado.`);
            }
        } catch (error: any) {
             console.error(`❌ Erro ao deletar pagamento: ${error.message}`);
        }
    }
}