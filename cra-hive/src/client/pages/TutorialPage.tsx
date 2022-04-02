import Hive from '../canvas/Hive'
import { State } from '../../shared/model/state'
import { Hive as HiveModel } from '../../shared/model/hive'
import Stone from '../../shared/model/stone'
import Insect from '../../shared/model/insects'
import Team from '../../shared/model/teams'
import { Drop } from '../../shared/model/action'
import TestGame from '../lab/TestGame';
import { Hex } from '../../shared/hexlib'
import { DropInsectMenuTeam, iconMap } from '../components/DropInsectMenu'
import { Button } from 'semantic-ui-react'

export default function TutorialPage() {
    // Idea: define terms
    // Make chapers: click to next page
    // Boxes for emphasis
    // Click to expand example
    // challenges: try to surround the enemy queen / get to this square
    // restricted games: only allowed to move certain insects

    // Legal drop hexes
    // When to place the bee
    // Moving
    // One hive rule
    return <div>
        <h1> Learn how to play! </h1>

        <Introduction />
        <Dropping />
        <GoalOfGame />
        <ExplainBee />
        <ExplainAnt />
        <ExplainSpider />
        <ExplainGrasshopper />
        <ExplainBeetle />

        <div className="ui one column doubling stackable grid container">
            <h2> Try everything at once</h2>
            <TestGame />
        </div>
    </div>
}

function TutorialLayout({ left, right }) {
    return <div className="ui two column doubling stackable grid container">
        <div className="column">
            {left}
        </div>
        <div className="column">
            {right}
        </div>
    </div>
}

function Introduction() {
    const state = new State();
    state.apply(new Drop(new Stone(Insect.GRASSHOPPER, Team.WHITE), new Hex(0, 0)));
    state.apply(new Drop(new Stone(Insect.ANT, Team.BLACK), new Hex(1, 0)));

    const left = <>
        <h2> Introduction </h2>
        Hive is a strategic boardgame for two players (red and blue).
        Each turn they can either place or move a stone on the board. We will refer to placing an insect as "dropping".
        We will call the stones "insects" from now on. Each of the insects
        has its own set of rules how to move.
        In the beginning there is void and the starting player can select any of his insects to drop.</>;
    const right = <Hive hive={state.hive} canvasHeight="200px" interactive={false} cameraOpts={{ position: [0, -1, 2] }} />;
    return <TutorialLayout left={left} right={right} />
}

function Dropping() {
    const state = new State();
    state.apply(new Drop(new Stone(Insect.GRASSHOPPER, Team.WHITE), new Hex(0, 0)));
    state.apply(new Drop(new Stone(Insect.ANT, Team.BLACK), new Hex(1, 0)));
    const left = <>
        <h2> Dropping </h2>
        <DropInsectMenuTeam stones={state.stones} active={true} />
        You can select an insect from this menu to drop. Note the numbers denoting how many of each type you still have available.
    </>;
    const right = <Hive hive={state.hive}
        team={state.team}
        highlighted={state.generateDrops().map(h => [h, 0])}
        canvasHeight="200px" interactive={false} cameraOpts={{ position: [0, -3, 4] }} />;
    return <TutorialLayout left={left} right={right} />
}

function GoalOfGame() {
    const hive = new HiveModel();
    hive.addStone(new Hex(0, 0), new Stone(Insect.GRASSHOPPER, Team.WHITE));
    hive.addStone(new Hex(1, 0), new Stone(Insect.BEE, Team.BLACK));
    hive.addStone(new Hex(0, 1), new Stone(Insect.BEE, Team.WHITE));
    hive.addStone(new Hex(1, 1), new Stone(Insect.ANT, Team.BLACK));
    hive.addStone(new Hex(1, -1), new Stone(Insect.SPIDER, Team.WHITE));
    hive.addStone(new Hex(2, 0), new Stone(Insect.BEETLE, Team.BLACK));
    hive.addStone(new Hex(2, -1), new Stone(Insect.ANT, Team.WHITE));

    const left = <>
        <h2> The Goal of the Game </h2>
        <p> The goal of the game is to surround the bee <Button color='grey' icon={iconMap[Insect.BEE]} /> of the enemy.

            All six adjacent hexes have to be occupied. </p>
        <p> In the example the blue player has lost as his bee is completely surrounded.
            Note that the color of the surrounding insects does not matter. Also the own insects count.
            It can happen that the bees get surrounded at the same time. In this case it is a draw. </p>
    </>;

    const right = <Hive hive={hive} canvasHeight="200px" interactive={false} cameraOpts={{ position: [1, 1, 4] }} lookAt={[1, 1, 0]} />;


    return <TutorialLayout left={left} right={right} />

}


function singleStone(stone) {
    const hive = new HiveModel();
    hive.addStone(new Hex(0, 0), stone);
    return <Hive hive={hive} canvasHeight="200px" interactive={false} cameraOpts={{ position: [0, -1, 1] }} lookAt={[0, 0, 0]} />;
}

function ExplainBee() {
    const left = <div>
        <h1>Bee <Button color='grey' icon={iconMap[Insect.BEE]} /></h1>
    </div>;
    const right = singleStone(new Stone(Insect.BEE, Team.WHITE));
    return <TutorialLayout left={left} right={right} />

}

function ExplainAnt() {
    const left = <h1>Ant <Button color='grey' icon={iconMap[Insect.ANT]} /></h1>;
    const right = singleStone(new Stone(Insect.ANT, Team.BLACK));
    return <TutorialLayout left={left} right={right} />

}

function ExplainSpider() {
    const left = <div>
        <h1>Spider <Button color='grey' icon={iconMap[Insect.SPIDER]} /></h1>
    </div>;
    const right = singleStone(new Stone(Insect.SPIDER, Team.WHITE));
    return <TutorialLayout left={left} right={right} />
}

function ExplainGrasshopper() {
    const left = <div>
        <h1>Grasshopper <Button color='grey' icon={iconMap[Insect.GRASSHOPPER]} /></h1>
    </div>;
    const right = singleStone(new Stone(Insect.GRASSHOPPER, Team.BLACK));
    return <TutorialLayout left={left} right={right} />
}


function ExplainBeetle() {
    const left = <div>
        <h1>Beetle <Button color='grey' icon={iconMap[Insect.BEETLE]} /></h1>
    </div>;
    const right = singleStone(new Stone(Insect.BEETLE, Team.WHITE));
    return <TutorialLayout left={left} right={right} />
}
