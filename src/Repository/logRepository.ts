import { Log } from "../Model";
import { dbPromisse } from "../repository";


export class LogRepository {
    /** Cria um novo registro de log no banco de dados. */
    static async criar(usuarioId: number, acao: string) {
        const db = await dbPromisse;
        const uId = usuarioId > 0 ? usuarioId : null; // Lida com o ID 0 para falhas de login
        await db.run(
            `INSERT INTO logs (usuarioId, acao) VALUES (?, ?)`,
            [uId, acao]
        );
        return true;
    }

    /** Lista todos os logs, incluindo o nome do usuário responsável. */
    static async listarTodos() {
        const db = await dbPromisse;
        return db.all<Log[]>(`
            SELECT 
                l.id, u.nome AS usuario, l.acao, l.dataHora 
            FROM logs l 
            LEFT JOIN usuarios u ON l.usuarioId = u.id 
            ORDER BY l.dataHora DESC
        `);
    }
}