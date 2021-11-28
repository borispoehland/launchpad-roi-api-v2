require('dotenv/config')

const listEndpoints = require('express-list-endpoints')

const app = require('express')()

app.use('/seedify', require('./launchpads/seedify'))

app.get('/', function (req, res) {
    return res.json(listEndpoints(app))
})

app.listen(process.env.PORT, () =>
    console.log(`Launchpad ROI app listening on port ${process.env.PORT}!`)
)
