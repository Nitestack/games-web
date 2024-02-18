import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.render("home", {
    subTitle: "Home"
}));

router.get("/tictactoe", (req, res) => res.render("tictactoe", {
    subTitle: "Tic Tac Toe"
}));

router.get("/connect4", (req, res) => res.render("connect4", {
    subTitle: "Connect 4"
}));

router.get("/supportserver", (req, res) => res.redirect("https://discord.gg/gxgjt2u2AP"));

export default router;