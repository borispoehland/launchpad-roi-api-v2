const axios = require('axios')

const trimNumber = (num) => +num.toFixed(2)
const formatName = (name) => name.replace(' Token', '')

const fetchSingleCoinData = async (coinId, idoPrice) => {
    const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        {
            params: {
                localization: false,
                tickers: false,
                community_data: false,
                developer_data: false,
                sparkline: false,
            },
        }
    )

    const ath = response.data['market_data']['ath']['usd']
    const current = response.data['market_data']['current_price']['usd']
    const id = response.data['id']
    const name = response.data['name']
    const image = response.data['image']['small']

    return {
        id,
        idoPrice,
        image,
        ath: trimNumber(ath),
        current: trimNumber(current),
        athROI: trimNumber(ath / idoPrice),
        currentROI: trimNumber(current / idoPrice),
        name: formatName(name),
    }
}

const fetchCoinData = (coins) => {
    let data
    let reFetch = true // ensures that every second request is served from cache, needed because of JetEngine flaws
    return async () => {
        if (reFetch) {
            data = await Promise.all(
                Object.keys(coins).map((coinId) =>
                    fetchSingleCoinData(coinId, coins[coinId])
                )
            )
        }
        reFetch = !reFetch
        return data
    }
}

const parseOverviewData = (data) => {
    const sortedData = [...data].sort((a, b) => b.athROI - a.athROI)
    const highestXCoin = sortedData[0]
    const lowestXCoin = sortedData[data.length - 1]

    const avgXAllCoins = trimNumber(
        data.reduce((a, b) => a + b.athROI, 0) / data.length
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

    return [highestX, avgX, lowestX]
}

module.exports = {
    fetchCoinData,
    parseOverviewData,
}
