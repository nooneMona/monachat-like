import { Avatar } from "./avatar";
import { Direction, DirectionValue } from "./direction";
import { Position } from "./position";
import { Status } from "./status";

export class Character {
  // キャラクターの状態
  avatar: Avatar = Avatar.default();
  position: Position = Position.zero();
  direction: Direction = Direction.instantiate(DirectionValue.Right);
  status: Status = new Status(undefined);

  // 現在いる部屋 (undefinedは入室する前の段階）
  currentRoom: string | undefined = undefined;

  updateAvatar(avatar: Avatar): Character {
    const newCharacter = this.copy();
    newCharacter.avatar = avatar.copy();
    return newCharacter;
  }

  movePosition(to: Position): Character {
    const newCharacter = this.copy();
    newCharacter.position = to.copy();
    return newCharacter;
  }

  turn(to: Direction): Character {
    const newCharacter = this.copy();
    newCharacter.direction = to.copy();
    return newCharacter;
  }

  updateStatus(status: Status): Character {
    const newCharacter = this.copy();
    newCharacter.status = status.copy();
    return newCharacter;
  }

  moveRoom(room: string): Character {
    const newCharacter = this.copy();
    newCharacter.currentRoom = room;
    return newCharacter;
  }

  copy(): Character {
    const character = new Character();
    character.avatar = this.avatar.copy();
    character.position = this.position.copy();
    character.direction = this.direction.copy();
    character.status = this.status.copy();
    character.currentRoom = this.currentRoom;
    return character;
  }
}
