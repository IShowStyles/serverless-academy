const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = process.env.TELEGRAM_BOT_TOKEN;
const NodeCache = require('node-cache');
const bot = new TelegramBot(token, {polling: true});
const myCache = new NodeCache({stdTTL: 600});
bot.onText(/\/start/, async (msg) => {
    await getForecastWind('3h');
    await getForecastWind('6h');
    await getRates('usd');
    await getRates('eur');
    await getForecast('3h');
    await getForecast('6h');
    bot.sendMessage(msg.chat.id, 'Welcome to the bot! Please choose an option:', {
        reply_markup: {
            keyboard: [
                [
                    {text: 'Exchange Rates'},
                    {text: 'Forecast in London'}
                ]
            ]
        }
    });
});

bot.on("message", (msg) => {
    switch (msg.text) {
        case "Exchange Rates":
            bot.sendMessage(msg.chat.id, 'Please choose a currency:', {
                reply_markup: {
                    keyboard: [
                        [
                            {text: 'USD'},
                            {text: 'EUR'},
                        ],
                        [
                            {
                                text: 'Повернутися'
                            }
                        ]
                    ]
                }
            });
            break;
        case "Forecast in London":
            bot.sendMessage(msg.chat.id, 'Please choose a forecast interval:', {
                reply_markup: {
                    keyboard: [
                        [
                            {text: 'Last 3-hour forecast'},
                            {text: 'Last 6-hour forecast'},
                        ],
                        [
                            {"text": "Wind speed"},
                        ],
                        [
                            {
                                text: 'Повернутися'
                            }
                        ]
                    ]
                }
            });
            break;
        case "Повернутися":
            bot.sendMessage(msg.chat.id, 'Please choose an option:', {
                reply_markup: {
                    keyboard: [
                        [
                            {text: 'Exchange Rates'},
                            {text: 'Forecast in London'}
                        ]
                    ]
                }
            });
            break;
    }
});


bot.on('message', async (msg) => {
    switch (msg.text) {
        case "USD":
            const data = await getRates('usd');
            bot.sendMessage(msg.chat.id, `Exchange rates for $:\n${data}`);
            break;
        case "EUR":
            const data2 = await getRates('eur');
            bot.sendMessage(msg.chat.id, `Exchange rates for €:\n${data2}`);
            break;
        case "Last 3-hour forecast":
            const data3 = await getForecast('3h');
            bot.sendMessage(msg.chat.id, `Weather forecast for London (3h interval):\n${data3}`);
            break;
        case "Last 6-hour forecast":
            const data4 = await getForecast('6h');
            bot.sendMessage(msg.chat.id, `Weather forecast for London (6h interval):\n${data4}`);
            break;
        case "Wind speed":
            const data5 = await getForecastWind('wind');
            bot.sendMessage(msg.chat.id, `Wind speed for London:\n${data5}`);
            break;
    }
})

const getRates = async (currency) => {
    const cacheKey = `rates-${currency}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    try {
        const response = await axios.get(`https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5`);
        const data = response.data.filter((item) => {
            return item.ccy.toLowerCase() === currency.toLowerCase();
        }).map((item) => {
            return `${item.ccy}/${item.base_ccy} ${item.buy.slice(0, 5)}/${item.sale.slice(0, 5)}`;
        });
        myCache.set(cacheKey, data);
        return data;
    } catch (e) {
        console.log(e)
    }
}

const getForecast = async (interval) => {
    const cacheKey = `forecast-${interval}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    try {
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        const queryParamInterval = interval === '3h' ? currentTimeStamp - 3 * 60 * 60 : currentTimeStamp - 6 * 60 * 60;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.API_KEY}&dt=${queryParamInterval}?units=metric`);
        const data = response.data.list.map((item) => (
            `${item.dt_txt}: ${item.weather[0].description}`
        )).slice(0, 12).join('\n');
        myCache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.log(error)
    }
}

const getForecastWind = async (interval) => {
    const cacheKey = `forecast-${interval}-wind`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    try {
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        const queryParamInterval = interval === '3h' ? currentTimeStamp - 3 * 60 * 60 : currentTimeStamp - 6 * 60 * 60;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.API_KEY}&dt=${queryParamInterval}?units=metric`);
        const data = response.data.list.map((item) => {
            return `${item.dt_txt}: ${item.wind.speed} m/s`;
        }).slice(0, 12).join('\n');
        myCache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.log(error)
    }
}