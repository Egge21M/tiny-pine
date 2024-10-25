import { createPortal } from "react-dom";
import ModalWrapper from "../../components/ModalWrapper";
import { useStopScroll } from "../../hooks/useStopScroll";
import { useAppSelector } from "../../store/store";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { deleteItem } from "../../store/products";

function ProductList() {
  useStopScroll();
  const [, setSearchParams] = useSearchParams();
  const products = useAppSelector((state) => state.products.products);
  const productList = Object.keys(products);

  const dispatch = useDispatch();

  return (
    <ModalWrapper>
      <p>Edit Products</p>
      <div className="flex flex-col gap-1 w-full">
        {productList.map((p) => (
          <div className="bg-zinc-100 shadow border-zinc-800 border-[1px] px-2 py-1 rounded">
            <button
              onClick={() => {
                dispatch(deleteItem(products[p].id));
              }}
            >
              {products[p].name}
            </button>
          </div>
        ))}
      </div>
      <Button
        title="Close"
        onClick={() => {
          setSearchParams("");
        }}
      />
    </ModalWrapper>
  );
}

function ProductListModal() {
  return createPortal(<ProductList />, document.getElementById("modal")!);
}

export default ProductListModal;
