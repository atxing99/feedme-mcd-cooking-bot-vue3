import moment from "moment";

export interface Order {
  id: number;
  isVIP: boolean;
  botId: number | null;
  isCompleted: boolean;
  cookPeriod: number | null;
  isDeleted: boolean;
  completedAt: string;
  cookTimer?:NodeJS.Timer;
}

export function resetOrder(order: Order) {
  if(order.cookTimer)
  clearInterval(order.cookTimer);
  order.cookPeriod = null;
  order.botId = null;
}

export function completeOrder(order: Order) {
  order.isCompleted = true;
  order.completedAt = moment(Date.now()).toISOString();
}