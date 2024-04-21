import { atom, useAtom } from "jotai";
import { UserSubsetSS } from "../services/sonamu.generated";

export const atomUserInfoState = atom({
  id: undefined as number | undefined,
  name: "",
});

atomUserInfoState.onMount = (set) => {
  const userJSON = localStorage.getItem("user");
  if (userJSON) {
    const user = JSON.parse(userJSON);
    set(user);
  }
};

export const atomUserInfo = atom(
  (get) => get(atomUserInfoState),
  (_get, set, update: UserSubsetSS) => {
    set(atomUserInfoState, update);
    localStorage.setItem("user", JSON.stringify(update));
  }
);
