import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();
//@ts-ignore
import rootRouter from "@routes/root";
import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from "cookie-parser";
import { join } from "path";
import methodOverride from 'method-override';

const app = express();
app.set('views', join(__dirname, "Views"));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(join(__dirname, "Dist")));
app.locals.basedir = join(__dirname, "Dist");
app.use(rootRouter);
app.all('*', (req, res) => res.render("Errors/404"));
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`The dashboard is live on http://localhost:${port} !`));