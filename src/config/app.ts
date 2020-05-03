import { UserRepository } from '../repos/user-repo';
import { UserService } from '../services/user-service';
import { CharRepository } from '../repos/char-repo';
import { CharService } from '../services/char-service';
import { StatRepository } from '../repos/stat-repo';
import { StatService } from '../services/stat-service';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const charRepo = new CharRepository();
const charService = new CharService(charRepo);

const statRepo = new StatRepository();
const statService = new StatService(statRepo);


export default {
    userService,
    charService,
    statService
};