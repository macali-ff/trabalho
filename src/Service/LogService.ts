// src/service/LogService.ts

import { LogRepository } from "../Repository/logRepository";


export class LogService {
    /** Serviço simples para listar os logs */
    static async listarLogs() {
        return LogRepository.listarTodos();
    }
}