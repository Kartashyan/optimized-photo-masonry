import { createContext, useReducer } from "react";
import { appConfigs, AppConfigs } from "../../../infrastructure/app-configs";

export const AppConfigsContext = createContext<AppConfigs>(appConfigs);
type ConfigAction = { type: string; payload: Partial<AppConfigs> };

export const AppConfigsDispatchContext = createContext<
  React.Dispatch<ConfigAction>
>(() => {});

export const AppConfigsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(configReducer, appConfigs);

  return (
    <AppConfigsContext.Provider value={state}>
      <AppConfigsDispatchContext.Provider value={dispatch}>
        {children}
      </AppConfigsDispatchContext.Provider>
    </AppConfigsContext.Provider>
  );
};

function configReducer(state: AppConfigs, action: ConfigAction) {
  switch (action.type) {
    case 'UPDATE_CONFIGS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
