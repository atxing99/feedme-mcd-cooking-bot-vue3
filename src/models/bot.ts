export interface Bot {
  id: number;
  orderId: number | null;
  timer?: NodeJS.Timeout | null;
}
