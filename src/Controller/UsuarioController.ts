
import { Usuario } from "../Model"; 
import { UsuarioService } from "../Service/UsuarioService";

export class UsuarioController {
    
    static async tentarLogin(email: string, senha: string) {
        return UsuarioService.login(email, senha);
    }
    
    static async cadastrar(usuarioLogadoId: number, data: Omit<Usuario, "id" | "dataCriacao">) {
        try {
            const id = await UsuarioService.criar(usuarioLogadoId, data);
            console.log(` Usuário cadastrado com sucesso! ID: ${id}`);
        } catch (error: any) {
            console.error(` Erro ao cadastrar usuário: ${error.message}`);
        }
    }

    // 2. CORREÇÃO: Implementação do método 'listar'
    static async listar() {
        try {
            const lista = await UsuarioService.listar(); 
            console.log("\n=== LISTA DE FUNCIONÁRIOS ===");
            console.table(lista);
        } catch (error: any) {
            console.error(` Erro ao listar usuários: ${error.message}`);
        }
    }
    
    static async deletar(usuarioLogadoId: number, id: number) {
        try {
            await UsuarioService.deletar(usuarioLogadoId, id);
            console.log(` Usuário ID ${id} deletado com sucesso.`);
        } catch (error: any) {
             console.error(` Erro ao deletar usuário: ${error.message}`);
        }
    }
}
