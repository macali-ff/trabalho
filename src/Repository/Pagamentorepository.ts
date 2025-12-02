import { ItemPagamento, Pagamento } from "../Model";
import { dbPromisse } from "../repository";

// Tipo auxiliar para lidar com a string 'itens' retornada do DB
type PagamentoDB = Omit<Pagamento, 'itens'> & { itens: string };

export class PagamentoRepository {
    
    // C (CREATE)
    static async criar(p: Omit<Pagamento, "id" | "dataCriacao">) {
        const db = await dbPromisse;
        
        // Serializa array para string
        const itensJson = JSON.stringify(p.itens); 

        const result = await db.run(
            `INSERT INTO pagamentos (membroId, metodoPagamento, total, desconto, acrescimo, parcelas, itens) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [p.clienteId, p.metodoPagamento, p.total, p.desconto, p.acrescimo, p.parcelas, itensJson]
        );
        return result.lastID;
    }
    
    // R (READ - Listar Todos)
    static async listarTodos(): Promise<Pagamento[]> {
        const db = await dbPromisse;
        
        // CORREÇÃO AQUI: Removemos o <PagamentoDB[]> da função .all
        // E colocamos o 'as PagamentoDB[]' no final do comando.
        const resultados = (await db.all(
            `SELECT p.*, c.nome AS nomeCliente 
             FROM pagamentos p
             JOIN clientes c ON p.membroId = c.id
             ORDER BY p.dataCriacao DESC`
        )) as PagamentoDB[];
        
        // Agora o 'map' vai funcionar porque 'resultados' tem o tipo certo
        return resultados.map(p => ({
            ...p,
            itens: JSON.parse(p.itens) as ItemPagamento[]
        }));
    }
    
    // R (READ - Buscar por ID)
    static async buscarPorId(id: number): Promise<Pagamento | null> {
        const db = await dbPromisse;

        // CORREÇÃO AQUI: Mesmo esquema, usamos 'as PagamentoDB' no final
        const p = (await db.get(
            `SELECT * FROM pagamentos WHERE id = ?`, 
            [id]
        )) as PagamentoDB | undefined;
        
        if (!p) return null;

        return {
            ...p,
            itens: JSON.parse(p.itens) as ItemPagamento[]
        };
    }
    
    // U (UPDATE)
    static async atualizar(id: number, data: Partial<Omit<Pagamento, "id" | "dataCriacao">>) {
        const db = await dbPromisse;
        
        if (data.itens) {
            (data as any).itens = JSON.stringify(data.itens);
        }
        
        const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        if (setClauses.length === 0) return 0; 

        const result = await db.run(`UPDATE pagamentos SET ${setClauses} WHERE id = ?`, [...values, id]);
        return result.changes;
    }
    
    // D (DELETE)
    static async deletar(id: number) {
        const db = await dbPromisse;
        const result = await db.run(`DELETE FROM pagamentos WHERE id = ?`, [id]);
        return result.changes;
    }
}