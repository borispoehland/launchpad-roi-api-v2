require('dotenv/config')

const app = require('express')()
const listEndpoints = require('express-list-endpoints')
const getLaunchpadRoutes = require('./launchpads')

const fs = require('fs')
const path = require('path')

const getDirectories = (srcPath) =>
    fs
        .readdirSync(srcPath)
        .filter((file) => fs.statSync(path.join(srcPath, file)).isDirectory())

const launchpads = getDirectories(
    path.resolve(process.cwd(), './src/launchpads')
)

launchpads.forEach((launchpad) => {
    app.use(`/${launchpad}`, getLaunchpadRoutes(launchpad))
})

app.get('/', function (req, res) {
    return res.json(listEndpoints(app))
})

app.listen(process.env.PORT, () =>
    console.log(`Launchpad ROI app listening on port ${process.env.PORT}!`)
)
