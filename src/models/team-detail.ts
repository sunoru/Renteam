import { Trainer } from './trainer'
import { PokemonDetail } from './pokemon-detail'
import { BattleTeam } from './battle-team'

export class TeamDetail {
  trainer: Trainer;
  pokemonList: [PokemonDetail];
  battleTeam: BattleTeam;
}
