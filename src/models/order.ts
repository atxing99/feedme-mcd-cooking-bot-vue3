export interface Order {
  id: number;
  isVIP: boolean;
  botId: number | null;
  isCompleted: boolean;
  cookPeriod: number;
}

export interface Bot {
  id: number;
  orderId: number | null;
  timer?: NodeJS.Timeout | null;
}
