export type Item = {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  id: string;
};

export type BasketItem = Pick<Item, "id" | "name" | "price">;
