// src/controller/ClienteController.ts

// CORREÇÃO 3: Importar o Service
import { Cliente } from "../Model";
import { ClienteService } from "../Service/ClienteService";


export class ClienteController {
    
    // C (CREATE)
    static async cadastrar(clienteLogadoId: number, data: Omit<Cliente, "id" | "dataMatricula">) {
        try {
            // CORREÇÃO 1: O Controller DEVE chamar o Service.
            // O Service recebe usuarioLogadoId E os dados.
            const id = await ClienteService.criar(clienteLogadoId, data); 
            console.log(`✅ Cliente cadastrado com sucesso! ID: ${id}`);
        } catch (error: any) {
            console.error(`❌ Erro ao cadastrar cliente: ${error.message}`);
        }
    }

    // R (READ - Listar Todos)
    static async listar() {
        try {
            // CORREÇÃO 2: Chamar o método correto (listar) no Service, sem argumentos.
            const lista = await ClienteService.listar(); 
            console.log("\n=== LISTA DE CLIENTES ===");
            console.table(lista);
        } catch (error: any) {
            console.error(`❌ Erro ao listar clientes: ${error.message}`);
        }
    }
    
    // R (READ - Buscar por ID)
    static async buscar(id: number) {
        try {
            // Agora ClienteService está importado e a chamada é correta.
            const cliente = await ClienteService.buscar(id); 
            if (cliente) {
                console.log(`\n=== DADOS DO CLIENTE ID ${id} ===`);
                console.table([cliente]);
            } else {
                console.log(`⚠️ Cliente ID ${id} não encontrado.`);
            }
        } catch (error: any) {
            console.error(`❌ Erro ao buscar cliente: ${error.message}`);
        }
    }

    // U (UPDATE)
   // Exemplo no ClienteController.ts, método atualizar:

static async atualizar(clienteLogadoId: number, id: number, data: Partial<Omit<Cliente, "id" | "dataMatricula">>) {
    try {
        // 1. Chama o Service
        const changesRaw = await ClienteService.atualizar(clienteLogadoId, id, data);
        
        // 2. CORREÇÃO: Usa o operador '?? 0' para garantir que changes seja um número (0 se for undefined)
        const changes = changesRaw ?? 0; 
        
        if (changes > 0) {
            console.log(`✅ Cliente ID ${id} atualizado com sucesso. (${changes} campo(s) alterado(s))`);
        } else {
            console.log(`⚠️ Cliente ID ${id} não encontrado ou nenhum dado novo fornecido.`);
        }
    } catch (error: any) {
        console.error(`❌ Erro ao atualizar cliente: ${error.message}`);
    }
}
    
    // D (DELETE)
    // ... dentro da classe ClienteController

  
    static async deletar(clienteLogadoId: number, id: number) {
        try {
            // Chamada correta ao Service.
            const changesRaw = await ClienteService.deletar(clienteLogadoId, id);
            
            // CORREÇÃO: Garante que changes é 0 se for undefined.
            const changes = changesRaw ?? 0; 
            
            if (changes > 0) {
                console.log(`✅ Cliente ID ${id} deletado com sucesso.`);
            } else {
                console.log(`⚠️ Cliente ID ${id} não encontrado.`);
            }
        } catch (error: any) {
             console.error(`❌ Erro ao deletar cliente: ${error.message}`);
        }
    }
} // Certifique-se de que a chave final da classe está correta