const express = require('express')
const router = express.Router()
const coins = require('./coins.json')
const { fetchCoinData, parseOverviewData } = require('../../common-logic')

const fetch = fetchCoinData(coins)

router.get('/overview', async function (req, res) {
    return res.json(parseOverviewData(await fetch()))
})

router.get('/detailed', async function (req, res) {
    return res.json(await fetch())
})

module.exports = router
