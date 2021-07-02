import { Ref, ref, reactive, inject, provide } from "vue";

/**
 * vue 3 store
 */
export const stateSymbol = Symbol("state");
export const createState = () => reactive({
  app: {}
});
export const useState = () => inject(stateSymbol);
export const provideState = () => provide(stateSymbol, createState());
