import bcrypt from 'bcryptjs'; // <--- Importamos a biblioteca
import { Usuario } from "../Model";
import { LogRepository } from "../Repository/logRepository";
import { UsuarioRepository } from "../Repository/UsuarioRepository";

export class UsuarioService {
    
    // R (READ - Login)
    static async login(email: string, senhaPlain: string): Promise<Usuario | null> {
        // 1. Busca o usuário pelo email
        const usuario = await UsuarioRepository.buscarPorEmail(email);
        
        // 2. Se o usuário existe, verificamos a senha
        if (usuario) {
            // A função compare verifica se a 'senhaPlain' (digitada) bate com o 'hash' (banco)
            const senhaBate = await bcrypt.compare(senhaPlain, usuario.senha);

            if (senhaBate) {
                await LogRepository.criar(usuario.id!, `Login realizado com sucesso.`);
                return usuario;
            }
        }

        // Se usuário não existe OU a senha não bate, falha o login (sem dizer qual dos dois errou por segurança)
        await LogRepository.criar(0, `Tentativa de login falhou para: ${email}`);
        return null;
    }

    // C (CREATE)
    static async criar(usuarioLogadoId: number, data: Omit<Usuario, "id" | "dataCriacao">) {
        if (!data.nome || !data.email || !data.senha || !data.cargo) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        // Validação: Verifica se já existe usuário com esse email
        const existe = await UsuarioRepository.buscarPorEmail(data.email);
        if (existe) {
            throw new Error("Já existe um usuário cadastrado com este e-mail.");
        }

        // CRIPTOGRAFIA AQUI:
        // O "10" é o custo de processamento (quanto maior, mais seguro e mais lento). 10 é o padrão.
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(data.senha, salt);

        // Substituímos a senha original pela criptografada antes de salvar
        const usuarioParaSalvar = {
            ...data,
            senha: senhaHash 
        };

        const id = await UsuarioRepository.criar(usuarioParaSalvar);
        
        await LogRepository.criar(usuarioLogadoId, `Criou novo usuário ID: ${id} (${data.cargo}).`);
        return id;
    }
    
    // R (Listar e Buscar) - Sem alterações
    static async listar(): Promise<Usuario[]> {
        return UsuarioRepository.listarTodos();
    }
    
    static async buscar(id: number): Promise<Usuario | undefined> {
        return UsuarioRepository.buscarPorId(id);
    }
    
    // U (UPDATE)
    static async atualizar(usuarioLogadoId: number, id: number, data: Partial<Omit<Usuario, "id" | "dataCriacao">>) {
        if (Object.keys(data).length === 0) {
            throw new Error("Nenhum dado para atualizar fornecido.");
        }
        
        const dadosAtualizados = { ...data };

        // Se estiver atualizando a senha, precisamos criptografar a nova senha também!
        if (dadosAtualizados.senha) {
            const salt = await bcrypt.genSalt(10);
            dadosAtualizados.senha = await bcrypt.hash(dadosAtualizados.senha, salt);
        }

        const resultado = await UsuarioRepository.atualizar(id, dadosAtualizados);
        await LogRepository.criar(usuarioLogadoId, `Atualizou usuário ID: ${id}.`);
        return resultado;
    }
    
    // D (DELETE) - Sem alterações
    static async deletar(usuarioLogadoId: number, id: number) {
        if (usuarioLogadoId === id) {
             throw new Error("Não é possível deletar a própria conta.");
        }
        const resultado = await UsuarioRepository.deletar(id);
        await LogRepository.criar(usuarioLogadoId, `Deletou usuário ID: ${id}.`);
        return resultado;
    }
}