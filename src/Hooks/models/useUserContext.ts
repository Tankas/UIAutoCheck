import { useContext } from "react";
import { Context } from "@/models/user";

export const useUserContext = () => {
  const { state, dispatch } = useContext(Context)
  return {
    state,
    dispatch,
  }
}