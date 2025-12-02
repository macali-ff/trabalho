import { Cliente } from "../Model";
import { dbPromisse } from "../repository"; // <--- Corrigido (agora com um 's')

export class ClienteRepository {
    
    // C (CREATE)
    static async criar(clientes: Omit<Cliente, "id">) {
        const db = await dbPromisse; // <--- Corrigido aqui
        const result = await db.run(
            `INSERT INTO clientes (nome, email, cpf, dataNascimento, dataMatricula) 
             VALUES (?, ?, ?, ?, ?)`, 
            [
                clientes.nome, 
                clientes.email, 
                clientes.cpf, 
                clientes.dataNascimento, 
                clientes.dataMatricula
            ]
        );
        return result.lastID;
    }
    
    // R (READ - Buscar por ID)
    static async buscarPorId(id: number): Promise<Cliente | undefined> {
        const db = await dbPromisse; // <--- Corrigido aqui
        
        return (await db.get(
            `SELECT * FROM clientes WHERE id = ?`, 
            [id]
        )) as Cliente | undefined;
    }

    // R (READ - Listar Todos)
    static async listarTodos(): Promise<Cliente[]> {
        const db = await dbPromisse; // <--- Corrigido aqui
        
        return (await db.all(`SELECT * FROM clientes`)) as Cliente[];
    }
    
    // U (UPDATE)
    static async atualizar(id: number, data: Partial<Omit<Cliente, "id" | "dataMatricula">>) {
        const db = await dbPromisse; // <--- Corrigido aqui
        const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        if (setClauses.length === 0) return 0; 

        const result = await db.run(`UPDATE clientes SET ${setClauses} WHERE id = ?`, [...values, id]);
        return result.changes ?? 0;
    }
    
    // D (DELETE)
    static async deletar(id: number) {
        const db = await dbPromisse; // <--- Corrigido aqui
        const result = await db.run(`DELETE FROM clientes WHERE id = ?`, [id]);
        return result.changes;
    }
}