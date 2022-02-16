import { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import WelcomePage from './pages/WelcomePage'
import AboutPage from './pages/AboutPage'
import DebugPage from './pages/DebugPage'
import TutorialPage from './pages/TutorialPage'
import 'semantic-ui-css/semantic.min.css'

import Layout from './pages/Layout'

const GameManager = lazy(() => import('./game/GameManager'))

export default function App() {
  return (
      <Router>
        <Layout>
          <Suspense fallback={<div>Loading...</div>} >
            <Switch>
              <Route exact path="/" component={WelcomePage} />
              <Route path="/play/:gid" component={GameManager} />
              <Route exact path="/debug" component={DebugPage} />
              <Route exact path="/about" component={AboutPage} />
              <Route exact path="/tutorial" component={TutorialPage} />
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  )
}
