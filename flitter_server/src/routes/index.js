import express from "express";

import unsubscribe from "./user/unsubscribe";
import updateUserHandler from "./user/update-user";
import getFlittersHandler from "./flitters/get-flitters";
import updateFlitterHandler from "./flitters/update-flitter";
import deleteFlitterHandler from "./flitters/delete-flitter";
import { logInValidator, logInHandler } from "./user/log-in";
import { signUpValidator, signUpHandler } from "./user/sign-up";
import { addFlitterValidator, addFlitterHandler } from "./flitters/add-flitter";
import { resetPasswordValidator, resetPasswordHandler } from "./user/reset-password";
import { forgotPasswordValidator, forgotPasswordHandler } from "./user/forgot-password";

const routes = express.Router();

routes.put('/update-user', updateUserHandler);
routes.delete('/unsubscribe/:id', unsubscribe);
routes.post('/login', logInValidator, logInHandler);
routes.post('/signup', signUpValidator, signUpHandler);
routes.post('/forgot-password', forgotPasswordValidator, forgotPasswordHandler);
routes.put('/reset-password/:resetPasswordCode', resetPasswordValidator, resetPasswordHandler);

routes.get('/flitters', getFlittersHandler);
routes.post('/flitters', addFlitterValidator, addFlitterHandler);
routes.put('/flitters/:id', updateFlitterHandler);
routes.delete('/flitters/:id', deleteFlitterHandler);

export default routes;