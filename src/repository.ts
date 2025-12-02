import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db: any;

export async function initDB() {
    if (db) return db; 

    db = await open({
        filename: "./academia.db",
        driver: sqlite3.Database
    });

    // Criação das tabelas
    await db.exec(`
        -- ============================
        -- TABELA DE USUÁRIOS
        -- ============================
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            cargo TEXT CHECK(cargo IN ('ADMIN', 'INSTRUTOR', 'STAFF')) NOT NULL,
            dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- ============================
        -- TABELA DE CLIENTES
        -- ============================
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            cpf TEXT UNIQUE,
            dataNascimento DATE,
            dataMatricula DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- ============================
        -- TABELA DE PLANOS
        -- ============================
        CREATE TABLE IF NOT EXISTS planos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            descricao TEXT,
            preco REAL NOT NULL,
            duracaoMeses INTEGER NOT NULL
        );

        -- ============================
        -- TABELA DE AULAS
        -- ============================
        CREATE TABLE IF NOT EXISTS aulas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            horario TEXT NOT NULL,
            instrutorId INTEGER NOT NULL,
            limiteAlunos INTEGER DEFAULT 0,
            FOREIGN KEY (instrutorId) REFERENCES usuarios (id) ON DELETE RESTRICT
        );

        -- ============================
        -- INSCRIÇÕES EM AULAS
        -- ============================
        CREATE TABLE IF NOT EXISTS inscricoes_aula (
            clienteId INTEGER NOT NULL,  -- Mantido clienteId conforme solicitado
            aulaId INTEGER NOT NULL,
            dataInscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (clienteId, aulaId),
            FOREIGN KEY (clienteId) REFERENCES clientes (id) ON DELETE CASCADE,
            FOREIGN KEY (aulaId) REFERENCES aulas (id) ON DELETE CASCADE
        );

        -- ============================
        -- PAGAMENTOS
        -- ============================
        CREATE TABLE IF NOT EXISTS pagamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clienteId INTEGER NOT NULL, -- Mantido clienteId conforme solicitado
            dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            metodoPagamento TEXT CHECK(metodoPagamento IN ('PIX', 'DEBITO', 'CREDITO', 'DINHEIRO')) NOT NULL,
            total REAL NOT NULL,
            desconto REAL DEFAULT 0,
            acrescimo REAL DEFAULT 0,
            parcelas INTEGER DEFAULT 1,
            itens TEXT, -- JSON armazenado como texto
            FOREIGN KEY (clienteId) REFERENCES clientes (id) ON DELETE RESTRICT
        );

        -- ============================
        -- LOGS DO SISTEMA
        -- ============================
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuarioId INTEGER NULL,
            acao TEXT NOT NULL,
            dataHora TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );
    `); 
    
    return db;
}

// Voltamos para 'dbPromisse' para não quebrar os imports dos outros arquivos
export const dbPromisse = initDB();