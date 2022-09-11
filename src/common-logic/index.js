const axios = require('axios').default
const rateLimit = require('axios-rate-limit')

// @ts-ignore
const http = rateLimit(axios.create(), {
    maxRequests: 20,
    perMilliseconds: 1000 * 62,
})

const trimNumber = (num) => {
    const toFixed = (num, precision) => {
        return (+(
            Math.round(+(num + 'e' + precision)) +
            'e' +
            -precision
        )).toFixed(precision)
    }
    const trailingZeros = -Math.floor(Math.log(num) / Math.log(10) + 1)
    return +toFixed(num, trailingZeros > 0 ? trailingZeros + 2 : 2)
}
const formatName = (name) => name.replace(' Token', '')

const fetchSingleCoinData = async (coinId, idoPrice) => {
    let response

    try {
        response = await http.get(
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
    } catch (error) {
        if (error.response.status === 404) {
            return {
                onCoinGecko: false,
                name: coinId,
                idoPrice,
                image: 'https://cryptoghub.com/wp-content/uploads/question_mark.png',
                id: null,
                ath: null,
                current: null,
                athROI: null,
                currentROI: null,
            }
        } else console.log('Error', error)
    }

    const ath = response.data['market_data']['ath']['usd']
    const current = response.data['market_data']['current_price']['usd']
    const id = response.data['id']
    const name = response.data['name']
    const image = response.data['image']['small']

    return {
        onCoinGecko: true,
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

module.exports = {
    fetchCoinData,
    trimNumber,
}
