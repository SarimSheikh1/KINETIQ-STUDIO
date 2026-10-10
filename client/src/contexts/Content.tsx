import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  projects,
  articles,
  team,
  positions,
} from "../../../shared/content.js";
import { api } from "../services/api";
const demo = { projects, articles, team, positions };
const Context = createContext<{ data: any; live: boolean; reload: () => void }>(
  { data: demo, live: false, reload: () => {} },
);
export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(demo);
  const [live, setLive] = useState(false);
  const reload = () => {
    api("/content")
      .then((value) => {
        setData(value);
        setLive(true);
      })
      .catch(() => setLive(false));
  };
  useEffect(reload, []);
  return (
    <Context.Provider value={{ data, live, reload }}>
      {children}
    </Context.Provider>
  );
}
export const useContent = () => useContext(Context);
