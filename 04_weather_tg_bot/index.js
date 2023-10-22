const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to the weather bot! Please choose an option:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Last 3-hour forecast', callback_data: 'london_3h'},
                    {text: 'Last 6-hour forecast', callback_data: 'london_6h'}
                ]
            ]
        }
    });
});
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data.split('_');
    const city = data[0];
    const interval = data[1];
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const queryParamInterval = interval === '3h' ? currentTimeStamp - 3 * 60 * 60 : currentTimeStamp - 6 * 60 * 60;
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&dt=${queryParamInterval}?units=metric`);
        const forecast = response.data.list.map((item) => {
            return `${item.dt_txt}: ${item.weather[0].description}`;
        }).slice(0, 12).join('\n');
        bot.sendMessage(chatId, `Weather forecast for ${city} (${interval} interval):\n${forecast}`);
    } catch (error) {
        bot.sendMessage(chatId, 'Sorry, I could not retrieve the weather information. Please try again later.');
    }
});