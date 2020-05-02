export interface UserSchema {
    user_id: number,
    username: string,
    password: string,
    account_name: string
}

export interface CharacterSchema {
    char_id: number;
    user_id: number;
    char_name: string;
    league_name: string;
    rank: number;
    char_level: number;
}

export interface StatSchema {
    stat_id: number;
    user_id: number;
    avg_rank: number;
    avg_char_level: number;
    improved: boolean;
    created_on: string;
}
