import { useContext } from "react";
import { Context } from "@/models/user";

export const useUserContext = () => {
  const { state, dispatch } = useContext(Context)
  const { showLoginWrapper, userInfo, showDesignPic, showScoreConfigWrapper, showDiffDimension } = state;
  return {
    state,
    dispatch,
    showLoginWrapper,
    userInfo,
    showDesignPic,
    showScoreConfigWrapper,
    showDiffDimension
  }
}