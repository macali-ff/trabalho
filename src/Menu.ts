import promptSync from 'prompt-sync';
import { CargoUsuario, Usuario } from './Model'; // Ajuste o caminho se necessário
import { initDB } from './repository'; // Ajuste o caminho se necessário

import { UsuarioController } from './Controller/UsuarioController';
import { ClienteController } from './Controller/ClienteController';
import { AulaController } from './Controller/AulaController';
import { PlanoController } from './Controller/PlanoController';
import { PagamentoController } from './Controller/PagamentoController';
import LogController from './Controller/LogController';

export class SistemaMenu {
    private prompt = promptSync({ sigint: true });
    private usuarioLogado: Usuario | undefined = undefined;

    // Método principal que inicia o sistema
    public async iniciar() {
        // Verifica admin inicial antes de começar o loop
        await this.verificarUsuarioInicial();

        while (true) {
            await this.menuPrincipal();
        }
    }

    // ==========================================================
    // CADASTRAR PRIMEIRO ADMIN AUTOMATICAMENTE
    // ==========================================================
    private async verificarUsuarioInicial() {
        const db = await initDB(); // Obtém a conexão
        const row: { total: number } = await db.get(
            "SELECT COUNT(*) AS total FROM usuarios"
        );

        if (!row || row.total === 0) {
            console.clear();
            console.log("===== PRIMEIRO ACESSO =====");
            console.log("Nenhum usuário encontrado!");
            console.log("Cadastre o usuário ADMIN inicial.\n");

            const nome = this.prompt("Nome do Administrador: ");
            const email = this.prompt("Email: ");
            const senha = this.prompt("Senha: ");

            await UsuarioController.cadastrar(0, {
                nome,
                email,
                senha,
                cargo: CargoUsuario.ADMIN
            });

            console.log("\n✔ Usuário ADMIN criado com sucesso!");
            this.prompt("Pressione ENTER para ir ao login...");
        }
    }

    // ==========================================================
    // LOGIN
    // ==========================================================
    private async telaLogin() {
        console.clear();
        console.log("--- TELA DE LOGIN ---");

        const email = this.prompt("Email: ");
        const senha = this.prompt("Senha: ");

        const usuario = await UsuarioController.tentarLogin(email, senha);

        if (usuario) {
            this.usuarioLogado = usuario;
            console.log(`\nBem-vindo(a), ${usuario.nome}!`);
        } else {
            console.log("\nEmail ou senha inválidos.");
        }
        this.prompt("Pressione Enter para continuar...");
    }

    // ==========================================================
    // MENU PRINCIPAL
    // ==========================================================
    private async menuPrincipal() {
        console.clear();
        console.log("======== SISTEMA DE GESTÃO DE ACADEMIA ========");

        if (!this.usuarioLogado) {
            console.log("1. Login");
            console.log("0. Sair");

            const opcao = this.prompt("Escolha uma opção: ");
            if (opcao === "1") await this.telaLogin();
            else if (opcao === "0") process.exit(0);
            else console.log("Opção inválida.");

            return;
        }

        console.log(`\nLogado como: ${this.usuarioLogado.nome} (${this.usuarioLogado.cargo})`);
        console.log("1. Gerenciar Clientes");
        console.log("2. Gerenciar Aulas");

        if (this.usuarioLogado.cargo === "ADMIN") {
            console.log("3. Gerenciar Planos");
            console.log("4. Gerenciar Funcionários");
            console.log("5. Visualizar Logs");
        }

        console.log("6. Registrar Pagamento");
        console.log("0. Logout");

        const opcao = this.prompt("Escolha uma opção: ");

        switch (opcao) {
            case "1": await this.menuClientes(); break;
            case "2": await this.menuAulas(); break;
            case "3": if (this.usuarioLogado!.cargo === "ADMIN") await this.menuPlano(); break;
            case "4": if (this.usuarioLogado!.cargo === "ADMIN") await this.menuUsuarios(); break;
            case "5": if (this.usuarioLogado!.cargo === "ADMIN") await LogController.listar(); break;
            case "6": await this.menuPagamentos(); break;
            case "0":
                this.usuarioLogado = undefined;
                console.log("Logout realizado.");
                break;
            default:
                console.log("Opção inválida.");
        }

        if (this.usuarioLogado) this.prompt("Pressione Enter para continuar...");
    }

    // ==========================================================
    // SUBMENUS
    // ==========================================================
    private async menuClientes() {
        let subOpcao = "";
        while (subOpcao !== "0") {
            console.clear();
            console.log("====== MENU CLIENTES ======");
            console.log("1. Listar");
            console.log("2. Cadastrar");
            console.log("3. Deletar");
            console.log("0. Voltar");

            subOpcao = this.prompt("Opção: ");

            switch (subOpcao) {
                case "1": await ClienteController.listar(); break;
                case "2":
                    {
                        const nome = this.prompt("Nome: ");
                        const email = this.prompt("Email: ");
                        const cpf = this.prompt("CPF: ");
                        const nasc = this.prompt("Data Nascimento (YYYY-MM-DD): ");
                        await ClienteController.cadastrar(this.usuarioLogado!.id!, {
                            nome, email, cpf, dataNascimento: nasc
                        });
                    }
                    break;
                case "3":
                    {
                        const idDel = Number(this.prompt("ID do cliente: "));
                        await ClienteController.deletar(this.usuarioLogado!.id!, idDel);
                    }
                    break;
            }
            if (subOpcao !== "0") this.prompt("ENTER para continuar...");
        }
    }

    private async menuAulas() {
        let subOpcao = "";
        while (subOpcao !== "0") {
            console.clear();
            console.log("====== MENU AULAS ======");
            console.log("1. Listar");
            console.log("2. Criar");
            console.log("0. Voltar");

            subOpcao = this.prompt("Opção: ");

            switch (subOpcao) {
                case "1": await AulaController.listar(); break;
                case "2":
                    {
                        const nomeA = this.prompt("Nome da aula: ");
                        const instrutor = Number(this.prompt("ID do instrutor: "));
                        const limite = Number(this.prompt("Limite de alunos: "));

                        await AulaController.cadastrar(this.usuarioLogado!.id!, {
                            nome: nomeA,
                            descricao: "Descrição padrão",
                            horario: "19:00",
                            instrutorId: instrutor,
                            limiteAlunos: limite
                        });
                    }
                    break;
            }
            if (subOpcao !== "0") this.prompt("ENTER para continuar...");
        }
    }

    private async menuUsuarios() {
        let subOpcao = "";
        while (subOpcao !== "0") {
            console.clear();
            console.log("====== FUNCIONÁRIOS ======");
            console.log("1. Listar");
            console.log("2. Cadastrar");
            console.log("0. Voltar");

            subOpcao = this.prompt("Opção: ");

            switch (subOpcao) {
                case "1": await UsuarioController.listar(); break;
                case "2":
                    {
                        const nome = this.prompt("Nome: ");
                        const email = this.prompt("Email: ");
                        const senha = this.prompt("Senha: ");
                        const cargoStr = this.prompt("Cargo (ADMIN/INSTRUTOR/STAFF): ");
                        const cargoUpper = cargoStr.toUpperCase();
                        const cargoValue = (CargoUsuario as any)[cargoUpper] ?? cargoUpper;

                        await UsuarioController.cadastrar(this.usuarioLogado!.id!, {
                            nome, email, senha, cargo: cargoValue
                        });
                    }
                    break;
            }
            if (subOpcao !== "0") this.prompt("ENTER para continuar...");
        }
    }

    // ==========================================================
    // PAGAMENTOS
    // ==========================================================
    private coletarItensPagamento() {
        const itens: any[] = [];
        while (true) {
            const idPlano = this.prompt("ID do plano (ou FIM): ");
            if (!idPlano) continue;
            if (idPlano.toUpperCase() === "FIM") break;

            const qtd = Number(this.prompt("Quantidade: "));
            const preco = Number(this.prompt("Preço unitário: "));

            itens.push({
                planoId: Number(idPlano),
                quantidade: qtd,
                precoUnitario: preco
            });
        }
        return itens;
    }

    private async menuPagamentos() {
        let subOpcao = "";
        while (subOpcao !== "0") {
            console.clear();
            console.log("====== PAGAMENTOS ======");
            console.log("1. Listar");
            console.log("2. Registrar");
            console.log("0. Voltar");

            subOpcao = this.prompt("Opção: ");

            switch (subOpcao) {
                case "1": await PagamentoController.listar(); break;
                case "2":
                    {
                        const clienteId = Number(this.prompt("ID do cliente: "));
                        const total = Number(this.prompt("Valor total: "));
                        const metodo = this.prompt("Método (PIX/DEBITO/CREDITO/DINHEIRO): ");

                        await PagamentoController.cadastrar(this.usuarioLogado!.id!, {
                            clienteId,
                            metodoPagamento: metodo,
                            total,
                            desconto: 0,
                            acrescimo: 0,
                            parcelas: 1,
                            itens: this.coletarItensPagamento()
                        });
                    }
                    break;
            }
            if (subOpcao !== "0") this.prompt("ENTER para continuar...");
        }
    }

    private async menuPlano() {
        let subOpcao = "";
        while (subOpcao !== "0") {
            console.clear();
            console.log("====== MENU PLANOS ======");
            console.log("1. Listar Planos");
            console.log("2. Criar Plano");
            console.log("0. Voltar");

            subOpcao = this.prompt("Opção: ");

            switch (subOpcao) {
                case "1": await PlanoController.listar(); break;
                case "2":
                    {
                        const nome = this.prompt("Nome do Plano: ");
                        const preco = Number(this.prompt("Preço: "));
                        const duracaoMeses = Number(this.prompt("Duração (meses): "));
                        await PlanoController.cadastrar(this.usuarioLogado!.id!, {
                            nome,
                            descricao: "Plano padrão",
                            preco,
                            duracaoMeses
                        });
                    }
                    break;
            }
            if (subOpcao !== "0") this.prompt("ENTER para continuar...");
        }
    }
}