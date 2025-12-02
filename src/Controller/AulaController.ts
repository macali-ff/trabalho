import { Aula } from "../Model";
import { AulaService } from "../Service/Aulaservice"; //
export class AulaController {
    
    
    static async cadastrar(usuarioLogadoId: number, data: Omit<Aula, "id">) {
        try {
            const id = await AulaService.criar(usuarioLogadoId, data);
            console.log(`✅ Aula cadastrada com sucesso! ID: ${id}`);
        } catch (error: any) {
            console.error(`❌ Erro ao cadastrar aula: ${error.message}`);
        }
    }

   
    static async listar() {
        try {
            const lista = await AulaService.listar();
            console.log("\n=== GRADE DE AULAS ===");
            console.table(lista);
        } catch (error: any) {
            console.error(`❌ Erro ao listar aulas: ${error.message}`);
        }
    }

    
    static async deletar(usuarioLogadoId: number, id: number) {
        try {
            const changes = await AulaService.deletar(usuarioLogadoId, id);
            if (changes && changes > 0) {
                console.log(`✅ Aula ID ${id} cancelada/removida com sucesso.`);
            } else {
                console.log(`⚠️ Aula ID ${id} não encontrada.`);
            }
        } catch (error: any) {
             console.error(`❌ Erro ao deletar aula: ${error.message}`);
        }
    }
}