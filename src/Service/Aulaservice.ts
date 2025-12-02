import { Aula } from "../Model";
import { AulaRepository } from "../Repository/AulaRepository";
import { LogRepository } from "../Repository/logRepository";
import { UsuarioRepository } from "../Repository/UsuarioRepository";

export class AulaService {
    
    // C (CREATE)
    static async criar(usuarioLogadoId: number, data: Omit<Aula, "id">) {
        // Validação: O instrutor deve ser um funcionário do cargo 'INSTRUTOR'
        const instrutor = await UsuarioRepository.buscarPorId(data.instrutorId);
        if (!instrutor || instrutor.cargo !== 'INSTRUTOR') {
            throw new Error("Usuário não é um instrutor válido.");
        }

        const id = await AulaRepository.criar(data);
        await LogRepository.criar(usuarioLogadoId, `Criou aula ID: ${id} (${data.nome}).`);
        return id;
    }

    // R (READ - Listar Todos)
    static async listar() {
        return AulaRepository.listarTodasComInstrutor();
    }
    
    // R (READ - Buscar por ID)
    static async buscar(id: number): Promise<Aula | undefined> {
        return AulaRepository.buscarPorId(id);
    }
    
    // U (UPDATE)
    static async atualizar(usuarioLogadoId: number, id: number, data: Partial<Omit<Aula, "id">>) {
        if (Object.keys(data).length === 0) {
            throw new Error("Nenhum dado para atualizar fornecido.");
        }
        
        // Validação: Se o instrutor for alterado, validar se o novo ID é INSTRUTOR
        if (data.instrutorId) {
            const instrutor = await UsuarioRepository.buscarPorId(data.instrutorId);
            if (!instrutor || instrutor.cargo !== 'INSTRUTOR') {
                throw new Error("Novo ID de instrutor inválido.");
            }
        }
        
        const resultado = await AulaRepository.atualizar(id, data);
        await LogRepository.criar(usuarioLogadoId, `Atualizou aula ID: ${id}.`);
        return resultado;
    }
    
    // D (DELETE)
    static async deletar(usuarioLogadoId: number, id: number) {
        const resultado = await AulaRepository.deletar(id);
        await LogRepository.criar(usuarioLogadoId, `Deletou aula ID: ${id}.`);
        return resultado;
    }
}