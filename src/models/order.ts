export interface Order {
  id: number;
  isVIP: boolean;
  botId: number | null;
  isCompleted: boolean;
  cookPeriod: number;
  isDeleted: boolean;
}
