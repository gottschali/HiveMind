import BackgroundCanvas from '../lab/BackgroundCanvas';
import GameList from '../components/GameList';

export default function WelcomePage () {

    return <div>
        <h1> Welcome to HiveMind </h1>
        <GameList />
        <BackgroundCanvas />
        </div>
}
