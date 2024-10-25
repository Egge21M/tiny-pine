import { useAppSelector } from "../../store/store";
import ProductCard from "./ProductCard";
import { useSearchParams } from "react-router-dom";
import AddProductModal from "./AddProductModal";
import { useState } from "react";
import OrderPreview from "./components/OrderPreview";
import Button from "../../components/Button";
import ProductListModal from "./ProductListModal";

const tabs = ["All", "Food", "Drinks"];

function ProductRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");
  const products = useAppSelector((state) => state.products.products);
  const productsList = Object.keys(products);
  const [activeTab, setActiveTab] = useState("All");
  return (
    <main className="grow bg-zinc-50 p-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 grow">
        <div className="flex flex-col col-span-2 gap-2">
          <div className="flex justify-between">
            <h1>Products</h1>
            <div className="flex gap-2">
              <Button
                title="Edit"
                onClick={() => {
                  setSearchParams("action=edit");
                }}
              />
              <Button
                title="+ Add Product"
                onClick={() => {
                  setSearchParams("action=add");
                }}
              />
            </div>
          </div>
          <ul className="flex bg-zinc-100 shadow-inner p-2 gap-2">
            {tabs.map((t) => (
              <li
                className={`bg-zinc-100 p-2 rounded ${activeTab === t ? "bg-zinc-300" : ""}`}
                onClick={() => {
                  setActiveTab(t);
                }}
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {productsList.map((id) => (
              <ProductCard item={products[id]} key={id} />
            ))}
          </div>
        </div>
        <OrderPreview />
      </div>
      {action === "add" ? <AddProductModal /> : undefined}
      {action === "edit" ? <ProductListModal /> : undefined}
    </main>
  );
}

export default ProductRoute;
