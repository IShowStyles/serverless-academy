const { program } = require('commander');
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(TOKEN, { polling: false });
program.version('1.0.0');
program
    .command('send-message <message>')
    .description('Send a message to the Telegram bot')
    .action(async (message) => {
        try {
            await bot.sendMessage(CHAT_ID, message);
            console.log("Message sent!");
            process.exit();
        } catch (error) {
            console.error("Failed to send message:", error);
            process.exit(1);
        }
    });
program
    .command('send-photo <path>')
    .description('Send a photo to the Telegram bot')
    .action(async (path) => {
        try {
            await bot.sendPhoto(CHAT_ID, path);
            console.log("Photo sent!");
            process.exit();
        } catch (error) {
            console.error("Failed to send photo:", error);
            process.exit(1);
        }
    });
program
    .command('help')
    .description('Show help information')
    .action(() => {
        program.outputHelp();
    });
program.parse(process.argv);
