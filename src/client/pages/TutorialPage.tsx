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
import { Button, Label, Segment } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import LocalSelfGame from '../game/LocalSelfGame'

export default function TutorialPage () {
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
        This page was created rather in a hurry.
        Therefore please consult the <a href='https://www.gen42.com/download/rules/hive/Hive_English_Rules.pdf'> official rules </a> if something is not clear.
        <Introduction />
        <GoalOfGame />
        <Dropping />
        <h2> Insects </h2>
        Here the different moves of the insects are quickly described.
        It is best to try them out in action. You can do this at the bottom of the page.
        All the insects have certain move restrictions in common.
        For one if the insect can not physically move through a passage it is blocked.
        Most important the one-hive rule applies to all.
        Make sure to read the section covering it.
        When playing you can simply click on one of your insects to get all possible moves highlighted.
        If none are highlighted this insect has no legal moves to make.
        <ExplainBee />
        <ExplainAnt />
        <ExplainSpider />
        <ExplainGrasshopper />
        <ExplainBeetle />

        <ExplainOneHive />
        <div className="ui one column doubling stackable grid container">
            <h2> Try everything at once</h2>
            If the game gets out of hand you can also reposition the camera to get a better view.
            You can take control of both players and try out the rules interactively.
            <LocalSelfGame />
        </div>
    </div>
}

function TutorialLayout({left, right}) {
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
    state.apply(new Drop(new Stone(Insect.GRASSHOPPER, Team.WHITE), Hex(0, 0)));
    state.apply(new Drop(new Stone(Insect.ANT, Team.BLACK), Hex(1, 0)));

    const left = <>
        <h2> Introduction </h2>
        Hive is a strategic boardgame for two players (red and blue).
        Each turn they can either place or move a stone on the board.
        We will refer to placing an insect as <i>dropping</i> and call the stones <i>insects</i> from now on.
        Similar to chess each of the insects has its own set of rules how to move.
        In the beginning there is void.
        The starting player can then select any of his insects to drop on the board.
        Their opponent may answer by an insect of their own adjacent to the insect already on the board.
        In the remainder of the game there are restrictions how insects may be dropped. These are covered in their own section.
    </>;
    const right = <Segment>
        <Hive hive={state.hive} canvasHeight="200px" interactive={false} cameraOpts={{ position: [0, -1, 2] }} />;
        <Label attached='bottom'>An example of the first two moves in a game.</Label>
        </Segment>
    return <TutorialLayout left={left} right={right} />
}

function Dropping() {
    const state = new State();
    state.apply(new Drop(new Stone(Insect.GRASSHOPPER, Team.WHITE), Hex(0, 0)));
    state.apply(new Drop(new Stone(Insect.ANT, Team.BLACK), Hex(1, 0)));
    const left = <>
        <h2> Dropping </h2>

        When playing you can select the insect you want to drop by clicking on the menu.
        The number tells you how many you have still available.
        After the first two moves you may only drop insects adjacent to your own.
        This prevents dropping insects directly placing next to the bee of the opponent and the game would not be funny at all.

        <br/>
        <DropInsectMenuTeam stones={state.stones}
                            active={true} />
    </>;
    const right = <Segment>
        <Hive hive={state.hive}
                        team={state.team}
                        highlighted={state.generateDrops().map(h => [h, 0])}
                      canvasHeight="200px" interactive={false} cameraOpts={ {position: [0, -3, 4]} } />;

        <Label attached='bottom'>The red player may only drop insects on the highlighted hexes.</Label>
    </Segment>;
    return <TutorialLayout left={left} right={right} />
}

function GoalOfGame() {
const hive = new HiveModel();
    hive.addStone(Hex(0, 0), new Stone(Insect.GRASSHOPPER, Team.WHITE));
    hive.addStone(Hex(1, 0), new Stone(Insect.BEE, Team.BLACK));
    hive.addStone(Hex(0, 1), new Stone(Insect.BEE, Team.WHITE));
    hive.addStone(Hex(1, 1), new Stone(Insect.ANT, Team.BLACK));
    hive.addStone(Hex(1, -1), new Stone(Insect.SPIDER, Team.WHITE));
    hive.addStone(Hex(2, 0), new Stone(Insect.BEETLE, Team.BLACK));
    hive.addStone(Hex(2, -1), new Stone(Insect.ANT, Team.WHITE));

    const left = <>
                <h2> The Goal of the Game </h2>
                <p> The goal of the game is to surround the bee <Button color='grey' icon={iconMap[Insect.BEE]} /> of the enemy.

                All six adjacent hexes have to be occupied. </p>
                <p> In the example the blue player has lost as his bee is completely surrounded.
                                                                                                          Note that the color of the surrounding insects does not matter. Also the own insects count.
                                                                                                          It can happen that the bees get surrounded at the same time. In this case it is a draw. </p>
            </>;

    const right = <Segment>
        <Hive hive={hive} canvasHeight="200px" interactive={false} cameraOpts={{ position: [1, 1, 4] }} lookAt={[1, 1, 0]} />;
        <Label attached='bottom'>Here the red player wins because the blue bee is completely surrounded while the red bee retains three free hexes next to it.</Label>
    </Segment>


    return <TutorialLayout left={left} right={right} />

}


function singleStone(stone) {
    const hive = new HiveModel();
    hive.addStone(Hex(0, 0), stone);
    return  <Hive hive={hive} canvasHeight="100px" interactive={false} cameraOpts={ {position: [0, -1, 1]} } lookAt={[0, 0, 0]}/>;
}

function ExplainBee() {
    const left = <div>
        <h2>Bee <Button color='grey' icon={iconMap[Insect.BEE]} /></h2>
        The be can only move one hex a move.
        <ul>
            <li> You may not move any insects before you have dropped your bee </li>
            <li> You have to drop the bee as one of your first <b>four</b> insects</li>
        </ul>
        </div>;
    const right = singleStone(new Stone(Insect.BEE, Team.WHITE));
    return <TutorialLayout left={left} right={right} />

}

function ExplainAnt() {
    const left = <div>
        <h3>Ant <Button color='grey' icon={iconMap[Insect.ANT]} /></h3>
        The ant is swift and can run as many hexes around the hive as it wishes.
    </div>
    const right = singleStone(new Stone(Insect.ANT, Team.BLACK));
    return <TutorialLayout left={left} right={right} />

}

function ExplainSpider() {
    const left = <div>
        <h3>Spider <Button color='grey' icon={iconMap[Insect.SPIDER]} /></h3>
        The spider is similar to the ant though it may only move exactly 3 hexes far.
    </div>;
    const right = singleStone(new Stone(Insect.SPIDER, Team.WHITE));
    return <TutorialLayout left={left} right={right} />
}

function ExplainGrasshopper() {
    const left = <div>
        <h3>Grasshopper <Button color='grey' icon={iconMap[Insect.GRASSHOPPER]} /></h3>
        The grasshopper can jump in any of the six directions over as many insects as that lie in that line.
        But it has to land on the first unoccupied hex.
    </div>;
    const right = singleStone(new Stone(Insect.GRASSHOPPER, Team.BLACK));
    return <TutorialLayout left={left} right={right} />
}


function ExplainBeetle() {
    const left = <div>
        <h3>Beetle <Button color='grey' icon={iconMap[Insect.BEETLE]} /></h3>
        The beetle is a distinct relative of the bee.
        But is has learned a useful skill: It may climb on other pieces and can walk on the top of the hive.
    </div>;
    const right = singleStone(new Stone(Insect.BEETLE, Team.WHITE));
    return <TutorialLayout left={left} right={right} />
}

function ExplainOneHive() {

    const hive = new HiveModel();
    hive.addStone(Hex(0, 0), new Stone(Insect.GRASSHOPPER, Team.WHITE));
    hive.addStone(Hex(2, 1), new Stone(Insect.BEE, Team.BLACK));
    hive.addStone(Hex(-1, 1), new Stone(Insect.BEE, Team.WHITE));
    hive.addStone(Hex(1, 1), new Stone(Insect.ANT, Team.BLACK));
    hive.addStone(Hex(1, -1), new Stone(Insect.SPIDER, Team.WHITE));
    hive.addStone(Hex(2, 0), new Stone(Insect.BEETLE, Team.BLACK));
    hive.addStone(Hex(2, -1), new Stone(Insect.ANT, Team.WHITE));

    const left = <div>
                <h2>One Hive Rule</h2>
                Or the rule that makes the game actually interesting.
        It goes like this: An insect can only move if the hive without it would be disconnected.
                This means there can never be isolated insects or groups thereof. Everything has to <i> stick together </i>.


                If you know graph theory you may know this idea as articulation points.
                </div>

    const right = <Segment>
        <Hive hive={hive} canvasHeight="200px" interactive={false} cameraOpts={{ position: [1, 1, 4] }} lookAt={[1, 1, 0]} />;
        <Label attached='bottom'>In this scenario the red player could only move his bee. His other insects would disconnect the hive into two parts.
        The blue player on the other hand could move either his ant or queen.</Label>
    </Segment>


    return <TutorialLayout left={left} right={right} />

}
