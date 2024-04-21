import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserSubsetSS } from "./services/sonamu.generated";
import { UserLoginParams } from "./services/user/user.types";
import { UserService } from "./services/user/user.service";
import { defaultCatch } from "./services/sonamu.shared";
import { useAtom } from "jotai";
import { atomUserInfo } from "./function/atom";

type AuthContext = {
  user: UserSubsetSS | null;
  login: (params: UserLoginParams) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = React.createContext({} as AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data: user, isLoading, mutate } = UserService.useMe();
  const [loading, setLoading] = React.useState(isLoading);
  const [userInfo, setUserInfo] = useAtom(atomUserInfo);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const value = {
    user: user ?? null,
    login: (loginParams: UserLoginParams) => {
      setLoading(true);
      UserService.login(loginParams)
        .then((user) => {
          setUserInfo(user);
          mutate().then(() => navigate("/"));
        })
        .catch(defaultCatch)
        .finally(() => setLoading(false));
    },
    logout: () => {
      setLoading(true);
      UserService.logout()
        .then(() => {
          setUserInfo({
            id: 0,
            phone: "",
            name: "",
            nickname: "",
            role: "normal",
          });
          mutate().then(() => navigate("/"));
        })
        .finally(() => {
          setLoading(false);
        });
    },
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
