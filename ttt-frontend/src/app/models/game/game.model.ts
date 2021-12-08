import { UserDTO } from '../user/user.model';

export class GameDTO {
  players: Array<UserDTO> | undefined | null = null;
  board: Array<Array<string>> | undefined | null = null;
  winner?: string | undefined | null = null;
  boardFull?: boolean | undefined | null = null;
}
