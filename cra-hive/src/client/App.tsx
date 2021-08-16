import { lazy, Suspense } from 'react';
import TestHive from './components/TestHive';
import TestGame from './components/TestGame';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import GameList from './components/GameList';
import 'semantic-ui-css/semantic.min.css'

import Layout from './pages/Layout'

const GameManager = lazy(() => import('./game/GameManager'))

export default function App() {
  return (
      <Router>
        <Layout>
          <Suspense fallback={<div>Loading...</div>} >
            <Switch>
              <Route path="/play/:gid" component={GameManager} />
              <Route exact path="/debug">
                <TestGame />
                <TestHive />
              </Route>
              <Route exact path="/join" component={GameList} />
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  )
}
