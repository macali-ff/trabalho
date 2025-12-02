export type ID = number;

export enum MetodoPagamento {
    PIX = "PIX",
    DEBITO = "DEBITO",
    CREDITO = "CREDITO",
    DINHEIRO = "DINHEIRO",
}

export enum CargoUsuario {
    ADMIN = "ADMIN",
    INSTRUTOR = "INSTRUTOR",
    STAFF = "STAFF",
}

// LOGS
export interface Log {
    id: ID;
    usuarioId: ID | null;
    acao: string;
    dataHora: string;
}

// USUÁRIOS
export interface Usuario {
    id?: ID; // MUDOU DE usuarioid PARA id
    nome: string;
    email: string;
    senha: string;
    cargo: CargoUsuario;
    dataCriacao?: string; // Coloquei opcional pois o banco gera
}

export interface Cliente {
    id?: ID; // MUDOU DE clienteid PARA id
    nome: string;
    email: string;
    cpf: string;
    dataNascimento: string;
    dataMatricula: string;
}

// AULAS
export interface Aula {
    id?: ID; // MUDOU DE aulaid PARA id
    nome: string;
    descricao: string;
    horario: string;
    instrutorId: ID;
    limiteAlunos: number;
}

// INSCRIÇÕES DE AULA
export interface InscricaoAula {
    clienteId: ID;
    aulaId: ID;
    dataInscricao?: string;
}

// PLANOS
export interface Plano {
    id?: ID; // MUDOU DE planoid PARA id
    nome: string;
    descricao: string;
    preco: number;
    duracaoMeses: number;
}

export interface ItemPagamento {
    planoId: ID;
    quantidade: number;
    precoUnitario: number;
}

// PAGAMENTOS 
export interface Pagamento {
    id?: ID;
    clienteId: ID;
    dataCriacao?: string;
    metodoPagamento: MetodoPagamento;
    total: number;
    desconto: number;
    acrescimo: number;
    parcelas: number;
    itens: ItemPagamento[];
}