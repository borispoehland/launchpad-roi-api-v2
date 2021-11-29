const express = require('express')
const router = express.Router()
const { fetchCoinData, parseOverviewData } = require('../common-logic')

module.exports = function (launchpad) {
    const coins = require(`./${launchpad}/coins.json`)

    const fetch = fetchCoinData(coins)

    router.get('/overview', async function (req, res) {
        return res.json(parseOverviewData(await fetch()))
    })

    router.get('/detailed', async function (req, res) {
        return res.json(await fetch())
    })

    return router
}
