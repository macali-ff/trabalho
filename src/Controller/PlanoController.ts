import { Plano } from "../Model";
import { PlanoService } from "../Service/PlanoService";

export class PlanoController {
    
    // C (CREATE)
    static async cadastrar(usuarioLogadoId: number, data: Omit<Plano, "id">) {
        try {
            const id = await PlanoService.criar(usuarioLogadoId, data);
            console.log(` Plano cadastrado com sucesso! ID: ${id}`);
        } catch (error: any) {
            console.error(` Erro ao cadastrar plano: ${error.message}`);
        }
    }

    // R (READ)
    static async listar() {
        try {
            const lista = await PlanoService.listar();
            console.log("\n=== TABELA DE PREÇOS (PLANOS) ===");
            console.table(lista);
        } catch (error: any) {
            console.error(` Erro ao listar planos: ${error.message}`);
        }
    }
    
    // D (DELETE)
    static async deletar(usuarioLogadoId: number, id: number) {
        try {
            const changes = await PlanoService.deletar(usuarioLogadoId, id);
            if (changes && changes > 0) {
                console.log(`Plano ID ${id} removido com sucesso.`);
            } else {
                console.log(` Plano ID ${id} não encontrado.`);
            }
        } catch (error: any) {
             console.error(` Erro ao deletar plano: ${error.message}`);
        }
    }
}
