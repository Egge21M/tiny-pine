import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addItem } from "../../store/basket";
import ProductCard from "./ProductCard";
import { Link, useSearchParams } from "react-router-dom";
import AddProductModal from "./AddProductModal";

function ProductRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");
  const products = useAppSelector((state) => state.products.products);
  const productsList = Object.keys(products);
  console.log(products);
  return (
    <main className="grow bg-zinc-50 p-4">
      <div>
        <h1>Products</h1>
        <button
          onClick={() => {
            setSearchParams("action=add");
          }}
        >
          + Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {productsList.map((id) => (
          <ProductCard item={products[id]} />
        ))}
        {/* <button */}
        {/*   onClick={() => { */}
        {/*     dispatch( */}
        {/*       addItem({ name: "Coffee", price: 2, id: "madeira-coffee" }), */}
        {/*     ); */}
        {/*   }} */}
        {/*   className="flex flex-col rounded bg-zinc-200 p-2 gap-2" */}
        {/* > */}
        {/*   <img */}
        {/*     className="h-32 object-cover rounded" */}
        {/*     src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" */}
        {/*   /> */}
        {/*   <div className="flex items-center justify-between"> */}
        {/*     <div className="text-left"> */}
        {/*       <p className="font-bold">Coffee</p> */}
        {/*       <p className="text-xs">Drink while it is still hot...</p> */}
        {/*     </div> */}
        {/*     <p>2 SATS</p> */}
        {/*   </div> */}
        {/* </button> */}
        {/* <button */}
        {/*   onClick={() => { */}
        {/*     dispatch( */}
        {/*       addItem({ name: "Steak", price: 21, id: "madeira-steak" }), */}
        {/*     ); */}
        {/*   }} */}
        {/*   className="flex flex-col rounded bg-zinc-200 p-2 gap-2" */}
        {/* > */}
        {/*   <img */}
        {/*     className="h-32 object-cover rounded" */}
        {/*     src="https://images.unsplash.com/photo-1504973960431-1c467e159aa4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" */}
        {/*   /> */}
        {/*   <div className="flex items-center justify-between"> */}
        {/*     <div className="text-left"> */}
        {/*       <p>Steak</p> */}
        {/*       <p className="text-xs">Rare and tasty</p> */}
        {/*     </div> */}
        {/*     <p>21 SATS</p> */}
        {/*   </div> */}
        {/* </button> */}
      </div>
      {action === "add" ? <AddProductModal /> : undefined}
    </main>
  );
}

export default ProductRoute;
