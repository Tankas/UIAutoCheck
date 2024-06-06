import { useUserContext } from "./models/useUserContext";
export const useLogin = () => {
  const { userInfo } = useUserContext()
  const isLogin = userInfo.name;
  return {
    isLogin
  }
}