export type Item = {
  name: string;
  description: string;
  price: number;
  id: string;
};

export type BasketItem = Pick<Item, "id" | "name" | "price">;

export type Order = {
  id: string;
  paymentId: string;
  amount: number;
  createdAt: number;
  state: "PAID" | "UNPAID";
};
