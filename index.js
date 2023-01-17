require("dotenv").config();

const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const cron = require("node-cron");
const { getSizePullRequests } = require("./bitbucket");
const { readLastCount, writeLastCount } = require("./jsonWork");

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN);

let size = readLastCount()["lastCount"] ?? 0;

bot.command("start", async (ctx) => {
  await ctx.reply(`Hello ${ctx.state.role}`);
});

async function taskExecute() {
  const actualSize = await getSizePullRequests();
  try {
    if (actualSize > size) {
      //     try:
      //     msg = text("🔥 У вас есть - " + bold(str(size)) + " Pull requests в статусе OPEN:\n")
      //     await bot.send_message("id группы", msg, parse_mode=ParseMode.MARKDOWN)
      // except:
      //     await message.reply("❗ ВАЖНО: Вам нужно добавиться к боту, все уведомления идут в ЛС!!!")
      // for request in bitBacketUtils.get_open_pull_requests():
      //     mess = text("🔹 Имя автора:  " + bold(request["Имя автора"]) + "\n"
      //                 "🔹 Имя ветки:  " + request["Commit branch"].replace("_", " ") + "\n"
      //                 "Состояние:  " + code(request["Состояние"]) + "\n"
      //                 "Роль:  " + code(request["Роль"]) + "\n"
      //                 "👉 Кол-во проверок:  " + bold(str(request["Кол-во проверок"])) + "\n"
      //                 "👉 Кол-во комментариев:  " + bold(str(request["Кол-во комментариев"])) + "\n"
      //                 "🙏 Проверьте меня): ", request["Проверьте меня)"])
      //     await bot.send_message("id группы", mess, parse_mode=ParseMode.MARKDOWN)
      // print("Wow " + str(size) + " " + str(size_2))
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
