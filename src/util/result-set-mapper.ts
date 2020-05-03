import { UserSchema, CharacterSchema, StatSchema } from "./schemas";
import { User } from "../models/user";
import { Character } from "../models/character";
import { Stat } from "../models/stat";

export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.user_id,
        resultSet.username,
        resultSet.password,
        resultSet.account_name
    );
}

export function mapCharacterResultSet(resultSet: CharacterSchema): Character {
    
    if (!resultSet) {
        return {} as Character;
    }

    return new Character(
        resultSet.char_id,
        resultSet.char_name,
        resultSet.league_name,
        resultSet.ranking,
        resultSet.char_level,
        resultSet.account_name
    );
}

export function mapStatResultSet(resultSet: StatSchema): Stat {
    
    if (!resultSet) {
        return {} as Stat;
    }

    return new Stat(
        resultSet.stat_id,
        resultSet.user_id,
        resultSet.avg_rank,
        resultSet.avg_char_level,
        resultSet.improved,
        resultSet.created_on
    );
}