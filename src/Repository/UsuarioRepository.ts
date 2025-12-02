import { Usuario } from "../Model";
import { dbPromisse } from "../repository";

export class UsuarioRepository {
    
    // C (CREATE)
    static async criar(u: Omit<Usuario, "id" | "dataCriacao">) {
        const db = await dbPromisse;
        const result = await db.run(
            `INSERT INTO usuarios (nome, email, senha, cargo) 
             VALUES (?, ?, ?, ?)`, 
            [u.nome, u.email, u.senha, u.cargo]
        );
        return result.lastID;
    }
    
    // R (READ - Buscar por ID)
    static async buscarPorId(id: number): Promise<Usuario | undefined> {
        const db = await dbPromisse;
        // Não retorna a senha por segurança
        return db.get<Usuario>(`SELECT id, nome, email, cargo, dataCriacao FROM usuarios WHERE id = ?`, [id]);
    }

    // R (READ - Buscar por Email)
    static async buscarPorEmail(email: string): Promise<Usuario | undefined> {
        const db = await dbPromisse;
        // Retorna a senha para fins de login/comparação
        return db.get<Usuario>(`SELECT * FROM usuarios WHERE email = ?`, [email]);
    }

    // R (READ - Listar Todos)
    static async listarTodos(): Promise<Usuario[]> {
        const db = await dbPromisse;
        // Não retorna a senha por segurança
        return db.all<Usuario[]>(`SELECT id, nome, email, cargo, dataCriacao FROM usuarios`);
    }
    
    // U (UPDATE)
    static async atualizar(id: number, data: Partial<Omit<Usuario, "id" | "dataCriacao">>) {
        const db = await dbPromisse;
        const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        if (setClauses.length === 0) return 0; 

        const result = await db.run(`UPDATE usuarios SET ${setClauses} WHERE id = ?`, [...values, id]);
        return result.changes; // Retorna o número de linhas alteradas
    }
    
    // D (DELETE)
    static async deletar(id: number) {
        const db = await dbPromisse;
        const result = await db.run(`DELETE FROM usuarios WHERE id = ?`, [id]);
        return result.changes;
    }
}