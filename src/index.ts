import { initDB } from './repository';
import { SistemaMenu } from './Menu';

(async () => {
    try {
        console.log("Inicializando banco de dados...");
        await initDB();

        console.log("Iniciando sistema de menus...");
        const menu = new SistemaMenu();
        await menu.iniciar();

    } catch (e) {
        console.error("ERRO FATAL NA APLICAÇÃO:", e);
        process.exit(1);
    }
})();