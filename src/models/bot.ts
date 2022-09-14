export interface Bot {
  id: number;
  orderId: number | null;
}

export function resetBot(bot: Bot) {
  bot.orderId = null;
}