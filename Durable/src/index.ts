export { OrderManager } from './order-manager';
export interface Env {
    ORDER_MANAGER: DurableObjectNamespace;
  }
  
  export default {
    async fetch(request: Request, env: Env) {
      const id = env.ORDER_MANAGER.idFromName("main");
      const stub = env.ORDER_MANAGER.get(id);
      return stub.fetch(request);
    }
  } satisfies ExportedHandler<Env>;
  