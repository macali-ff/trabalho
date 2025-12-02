import { Aula } from "../Model";
import { dbPromisse } from "../repository";


export class AulaRepository {
    
    // C (CREATE)
    static async criar(a: Omit<Aula, "id">) {
        const db = await dbPromisse;
        const result = await db.run(
            `INSERT INTO aulas (nome, descricao, horario, instrutorId, limiteAlunos) 
             VALUES (?, ?, ?, ?, ?)`, 
            [a.nome, a.descricao, a.horario, a.instrutorId, a.limiteAlunos]
        );
        return result.lastID;
    }
    
    // R (READ - Buscar por ID)
    static async buscarPorId(id: number): Promise<Aula | undefined> {
        const db = await dbPromisse;
        return db.get<Aula>(`SELECT * FROM aulas WHERE id = ?`, [id]);
    }

    // R (READ - Listar Todos com Instrutor)
    static async listarTodasComInstrutor() {
        const db = await dbPromisse;
        // Retorna o nome do instrutor para o Service/Controller usar
        return db.all<Aula[]>(`
            SELECT a.*, u.nome AS nomeInstrutor 
            FROM aulas a
            JOIN usuarios u ON a.instrutorId = u.id
        `);
    }
    
    // U (UPDATE)
    static async atualizar(id: number, data: Partial<Omit<Aula, "id">>) {
        const db = await dbPromisse;
        const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        if (setClauses.length === 0) return 0; 

        const result = await db.run(`UPDATE aulas SET ${setClauses} WHERE id = ?`, [...values, id]);
        return result.changes;
    }
    
    // D (DELETE)
    static async deletar(id: number) {
        const db = await dbPromisse;
        const result = await db.run(`DELETE FROM aulas WHERE id = ?`, [id]);
        return result.changes;
    }
}