import 'dotenv/config';

import express from 'express';

const app = express();

const seedifyRouter = require("./launchpads/seedify");

app.use("/seedify", seedifyRouter)

app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
);
