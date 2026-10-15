import { createApp } from "vue";
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import App from "./App.vue";
import "./assets/styles/index.css";

// Регистрация модулей AG Grid:
// https://www.ag-grid.com/vue-data-grid/modules/#registering-ag-grid-modules
// https://www.ag-grid.com/vue-data-grid/modules/
ModuleRegistry.registerModules([AllEnterpriseModule]);

createApp(App).mount("#app");
