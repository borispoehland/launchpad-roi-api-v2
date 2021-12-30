const axios = require('axios')

const trimNumber = (num) => (num ? +num.toFixed(2) : null)
const formatName = (name) => name.replace(' Token', '')

const fetchSingleCoinData = async (coinId, idoPrice) => {
    let response

    console.log('Hello from fetchSingleCoinData')

    try {
        response = await axios.get(
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
        console.log('Error', error)
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
        }
    }

    console.log('Response', response)

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
