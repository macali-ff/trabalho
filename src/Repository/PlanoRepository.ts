import { Plano } from "../Model";
import { dbPromisse } from "../repository";

export class PlanoRepository {
    
    // C (CREATE)
    static async criar(plano: Omit<Plano, "id">) {
        const db = await dbPromisse;
        const result = await db.run(
            `INSERT INTO planos (nome, descricao, preco, duracaoMeses) 
             VALUES (?, ?, ?, ?)`, 
            [plano.nome, plano.descricao, plano.preco, plano.duracaoMeses]
        );
        return result.lastID;
    }
    
    // R (READ - Buscar por ID)
    static async buscarPorId(id: number): Promise<Plano | undefined> {
        const db = await dbPromisse;
        
        // CORREÇÃO: Usando 'as Plano' no final
        return (await db.get(
            `SELECT * FROM planos WHERE id = ?`, 
            [id]
        )) as Plano | undefined;
    }

    // R (READ - Listar Todos)
    static async listarTodos(): Promise<Plano[]> {
        const db = await dbPromisse;
        
        // CORREÇÃO: Usando 'as Plano[]' no final
        return (await db.all(`SELECT * FROM planos`)) as Plano[];
    }
    
    // U (UPDATE)
    static async atualizar(id: number, data: Partial<Omit<Plano, "id">>) {
        const db = await dbPromisse;
        const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        if (setClauses.length === 0) return 0; 

        const result = await db.run(`UPDATE planos SET ${setClauses} WHERE id = ?`, [...values, id]);
        return result.changes;
    }
    
    // D (DELETE)
    static async deletar(id: number) {
        const db = await dbPromisse;
        const result = await db.run(`DELETE FROM planos WHERE id = ?`, [id]);
        return result.changes;
    }
}