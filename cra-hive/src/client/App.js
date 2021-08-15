import TestHive from './components/TestHive';
import TestGame from './components/TestGame';
import { OnlineGameManager } from './components/OnlineGame';
import QuickPlayLink from './components/QuickPlayLink'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import GameList from './components/GameList';

export default function App() {
  return (
    <Router>
      <h1>Welcome to HiveMind</h1>
      <QuickPlayLink />
      <Switch>
        <Route path="/play/:gid">
          <OnlineGameManager />          
        </Route>
        <Route exact path="/">
          <TestGame />
          <TestHive />
        </Route>
        <Route exact path="/join">
          <GameList />
        </Route>
    </Switch>
    </Router>
  )
}
