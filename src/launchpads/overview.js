const { fetchCoinData, trimNumber } = require('../common-logic')

const parseMinMaxAvg = (data, priceField, roiField, labelChunk) => {
    const filteredData = data.filter(
        (coin) => coin.onCoinGecko && coin[priceField]
    )
    const sortedData = filteredData.sort((a, b) => b[roiField] - a[roiField])

    const highestXCoin = sortedData[0]
    const lowestXCoin = sortedData[sortedData.length - 1]

    const avgXAllCoins = trimNumber(
        sortedData.reduce((a, b) => a + b[roiField], 0) / sortedData.length
    )

    const avgX = {
        label: `Average ${labelChunk} ROI`,
        value: avgXAllCoins,
        suffix: 'x',
    }

    const highestX = {
        label: `Max ${labelChunk} ROI (${highestXCoin.name})`,
        value: highestXCoin[roiField],
        suffix: 'x',
    }

    const lowestX = {
        label: `Min ${labelChunk} ROI (${lowestXCoin.name})`,
        value: lowestXCoin[roiField],
        suffix: 'x',
    }

    return [highestX, avgX, lowestX]
}

const parseOverviewData = (data) => {
    const igosHeld = {
        label: 'IGOs held',
        value: data.length,
    }

    return [
        ...parseMinMaxAvg(data, 'ath', 'athROI', 'ATH'),
        ...parseMinMaxAvg(data, 'current', 'currentROI', 'current'),
        igosHeld,
    ]
}

module.exports = async function (launchpad) {
    const coins = require(`./${launchpad}/coins.json`)

    const fetch = fetchCoinData(coins)

    return parseOverviewData(await fetch())
}
