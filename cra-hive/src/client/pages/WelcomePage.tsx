import BackgroundCanvas from '../lab/BackgroundCanvas';
import GameList from '../components/GameList';
import { Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function WelcomePage () {

    return <div>
        <h1> Welcome to HiveMind </h1>
            On this site you can play the awesome game Hive.
            Just create a game with the button in the top-bar and invite a friend to play.
            Make sure check out the <Link to='/tutorial'> tutorial </Link> for an introduction to the rules.
        Unfortunately the mobile version of this site sucks.
        <h2> The game Hive </h2>
        Hive is a abstract strategic board game designed by John Yianni
        and published by <a href='https://www.gen42.com/games/hive'> Gen 42</a>.
        If you want to know more about it <a href='https://boardgamegeek.com/boardgame/2655/hive'>boardgamegeek</a> is a good place to start.

        <h2> Development </h2>
        The frontend uses
        <a href='https://reactjs.org/'> react </a>
        bootstrapped by
        <a href='https://create-react-app.dev/'> Create React App </a>
        and
        <a href='https://react.semantic-ui.com/'> Semantic UI </a>
        <a href='https://socket.io/'> Socket.IO </a>
        is used to communicate between the backend which is powered by
        <a href='https://expressjs.com/'> Express </a>.
        The project started as a simple
        <a href='https://www.pygame.org/news'> Pygame </a>
        app and was rewritten multiple times.
        Most of the codebase is in a transition from javascript to <a href='https://www.typescriptlang.org/.'>Typescript </a>.
        If you are interested you can find the source code on
            <a href='https://github.com/gottschali/HiveMind'>
                <Button color='grey'>
                    <Icon name='github' /> Github
                </Button>
            </a>
        Just be aware that is my first bigger web-dev project and there are many ugly things lurking in the code.
        {/* <GameList />
        <BackgroundCanvas /> */}

        This is a side project of Ali G. In the future you may find more of his projects on <a href='https://gschall.ch/'> gschall.ch </a>.

        <a href="mailto:post@aligottschall.ch">Send some feedback</a>.
        </div>



}
