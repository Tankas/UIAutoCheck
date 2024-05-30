import { useContext } from "react";
import { ConfigContext } from "@/models/config";

export const useConfigContext = () => {
  const { state, dispatch } = useContext(ConfigContext)
  const { baseConfig, deviceConfig, weightConfig } = state;
  return {
    state,
    dispatch,
    baseConfig,
    deviceConfig,
    weightConfig
  }
}