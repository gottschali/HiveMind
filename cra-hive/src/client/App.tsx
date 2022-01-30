import { lazy, Suspense } from 'react';
import TestHive from './lab/TestHive';
import TestGame from './lab/TestGame';
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
              <Route exact path="/about">
                <iframe src="/README.html" title="Readme" style={{width: "100%", height: "100%", position: "absolute", border: "none"}} />
              </Route>
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  )
}
