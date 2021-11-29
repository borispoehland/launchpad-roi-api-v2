require('dotenv/config')

const app = require('express')()
const listEndpoints = require('express-list-endpoints')
const getOverview = require('./launchpads/overview')
const getDetailed = require('./launchpads/detailed')

app.get('/', function (req, res) {
    return res.json(listEndpoints(app))
})

app.get('/overview', async function (req, res) {
    const launchpad = req.query['launchpad'] || 'seedify'
    return res.json(await getOverview(launchpad))
})

app.get('/detailed', async function (req, res) {
    const launchpad = req.query['launchpad'] || 'seedify'
    return res.json(await getDetailed(launchpad))
})

app.listen(process.env.PORT, () =>
    console.log(`Launchpad ROI app listening on port ${process.env.PORT}!`)
)
