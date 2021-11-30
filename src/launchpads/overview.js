const { fetchCoinData, trimNumber } = require('../common-logic')

const parseOverviewData = (data) => {
    const filteredData = data.filter((coin) => coin.onCoinGecko)
    const sortedData = filteredData.sort((a, b) => b.athROI - a.athROI)

    const highestXCoin = sortedData[0]
    const lowestXCoin = sortedData[sortedData.length - 1]

    const avgXAllCoins = trimNumber(
        sortedData.reduce((a, b) => a + b.athROI, 0) / sortedData.length
    )

    const avgX = {
        label: 'Average ROI',
        value: avgXAllCoins,
    }

    const highestX = {
        label: `Maximum ROI (${highestXCoin.name})`,
        value: highestXCoin.athROI,
    }

    const lowestX = {
        label: `Minimum ROI (${lowestXCoin.name})`,
        value: lowestXCoin.athROI,
    }

    const igosHeld = {
        label: 'IGOs held',
        value: data.length,
    }

    return [highestX, avgX, lowestX, igosHeld]
}

module.exports = async function (launchpad) {
    const coins = require(`./${launchpad}/coins.json`)

    const fetch = fetchCoinData(coins)

    return parseOverviewData(await fetch())
}
