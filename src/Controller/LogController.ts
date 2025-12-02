import { LogService } from "../Service/LogService";

class LogController {
    static async listar() {
        try {
            const lista = await LogService.listarLogs();
            console.log("\n=== LOGS DO SISTEMA ===");
            console.table(lista);
        } catch (error: any) {
            console.error(`❌ Erro ao listar logs: ${error.message}`);
        }
    }
}

export default LogController