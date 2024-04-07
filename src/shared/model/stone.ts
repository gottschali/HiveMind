import Insect from './insects';
import Team from './teams';

export default class Stone {
  insect: Insect;
  team: Team;

  constructor(insect: Insect, team: Team) {
    this.insect = insect;
    this.team = team;
  }
}

