import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import Test from "./test";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/test" component={Test} />
    </Switch>
  </BrowserRouter>
);
export default Router;
