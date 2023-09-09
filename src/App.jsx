import { Provider } from "react-redux";
import { store } from "../redux-toolkit/store";

import { useRoutes } from "react-router-dom";
import Routes from "./Routes";
import { useEffect, useState } from "react";
import { EventBus } from "./utils/function";
import { PREVENT_SELECT } from "./utils/constant";

function App() {
  const pages = useRoutes(Routes);
  const [isPreventSelect, setIsPreventSelect] = useState(false);

  useEffect(() => {
      EventBus.on(PREVENT_SELECT, (flag) => {
        setIsPreventSelect(flag);
      });
      return () => {
          EventBus.remove(PREVENT_SELECT);
      };
  }, [])

  return <Provider store={store}><div className={`${isPreventSelect ? "select-none" : ""}`}>{pages}</div></Provider>;
}

export default App;
