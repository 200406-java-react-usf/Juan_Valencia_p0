//import dotenv from 'dotenv';
import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../errors/errors";

//dotenv.config();

export const adminGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.username === process.env['AU_USERNAME'] && req.session.principal.account_name === process.env['AU_ACCOUNT'] ) {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }

}

