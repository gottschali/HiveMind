import TestHive from './components/TestHive';
import TestGame from './components/TestGame';
import OnlineGame from './components/OnlineGame';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <h1>Welcome to HiveMind</h1>
      <Switch>
        <Route path="/play/:gid">
          <OnlineGame />          
        </Route>
        <Route exact path="/">
          <TestGame />
          <TestHive />
        </Route>
    </Switch>
    </Router>
  )
}
