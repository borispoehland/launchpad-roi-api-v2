require('dotenv/config')

const app = require('express')()
const listEndpoints = require('express-list-endpoints')
const getOverview = require('./launchpads/overview')
const getDetailed = require('./launchpads/detailed')

const PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()

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

app.post('/historical-roi', async function (req, res) {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':')

    // Verify login and password are set and correct
    if (
        !login ||
        !password ||
        login !== process.env.LOGIN ||
        password !== process.env.PASSWORD
    ) {
        // Access denied...
        res.set('WWW-Authenticate', 'Basic realm="401"') // change this
        return res.status(401).send('Authentication required.') // custom message
    }

    const launchpad = req.query['launchpad'] || 'seedify'
    const overviewData = await getOverview(launchpad)
    const avgATHRoi = overviewData[1].value
    const avgCurrentRoi = overviewData[4].value
    await prisma[`${launchpad}_ROI`].create({
        data: {
            avgATHRoi,
            avgCurrentRoi,
        },
    })

    return res.json({ success: true })
})

app.get('/historical-roi', async function (req, res) {
    const launchpad = req.query['launchpad'] || 'seedify'
    const rois = await prisma[`${launchpad}_ROI`].findMany({
        take: -30,
    })
    return res.json({
        labels: rois
            .map((val) =>
                val.date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'numeric',
                })
            )
            .join(', '),
        athData: rois.map((val) => val.avgATHRoi).join(', '),
        currentData: rois.map((val) => val.avgCurrentRoi).join(', '),
        max: Math.max(...rois.map((val) => val.avgATHRoi)),
    })
})

app.listen(process.env.PORT, () =>
    console.log(`Launchpad ROI app listening on port ${process.env.PORT}!`)
)
