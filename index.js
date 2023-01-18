require("dotenv").config();

const { Telegraf, Format } = require("telegraf");
const { message } = require("telegraf/filters");
const cron = require("node-cron");
const { getSizePullRequests, getOpenPullRequests } = require("./bitbucket");
const { readLastCount, writeLastCount } = require("./jsonWork");

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new Telegraf(BOT_TOKEN);

let size = readLastCount()["lastCount"] ?? 0;

bot.command("start", async (ctx) => {
  await ctx.reply(`Hello ${ctx.state.role}`);
});

async function taskExecute() {
  const actualSize = await getSizePullRequests();
  try {
    if (actualSize > size) {
      try {
        const msg =
          "🔥 У вас есть - " +
          Format.bold(String(size)) +
          " Pull requests в статусе OPEN:\n";
        console.log(msg);
        // await bot.telegram.sendMessage(CHAT_ID, msg, {
        //   parse_mode: "Markdown",
        // });
      } catch {
        await bot.context.reply(
          "❗ ВАЖНО: Вам нужно добавиться к боту, все уведомления идут в ЛС!!!"
        );
      }

      const openPullRequests = await getOpenPullRequests();
      for (const request of openPullRequests) {
        const msg =
          "🔹 Имя автора:  " +
          Format.bold(request.author) +
          "\n" +
          "🔹 Имя ветки:  " +
          request.title.replace("_", " ") +
          "\n" +
          "Состояние:  " +
          Format.code(request.state) +
          "\n" +
          "👉 Кол-во проверок:  " +
          Format.bold(String(request.count)) +
          "\n" +
          "👉 Кол-во комментариев:  " +
          Format.bold(String(request.comments)) +
          "\n" +
          "🙏 Проверьте меня): " +
          request.link;
        console.log(msg);
        // await bot.telegram.sendMessage(CHAT_ID, msg, {
        //   parse_mode: "Markdown",
        // });
      }

      size = actualSize;
      writeLastCount("lastCount", size);
    } else {
      size = actualSize;
      writeLastCount("lastCount", size);
    }
  } catch (error) {
    console.error(error);
    await bot.context.reply(
      "❗ Возникла ошибка, повторите команду! Или добавьтесь к боту!"
    );
  }
}

async function startCronJob() {
  // every two minutes
  // cron.schedule("*/2 * * * *", taskExecute);
  taskExecute();
}

// bot.launch();
startCronJob();
