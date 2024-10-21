import { createPortal } from "react-dom";
import ModalWrapper from "../../components/ModalWrapper";
import { useSearchParams } from "react-router-dom";
import { useStopScroll } from "../../hooks/useStopScroll";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { addItem } from "../../store/products";

function AddProduct() {
  const [, setParams] = useSearchParams();
  const dispatch = useDispatch();

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  useStopScroll();

  return (
    <ModalWrapper>
      <p>Add a product</p>
      <div className="flex flex-col gap-2">
        <input
          className="p-2 bg-zinc-200 rounded"
          placeholder="name"
          ref={nameRef}
        />
        <input
          className="p-2 bg-zinc-200 rounded"
          placeholder="description"
          ref={descRef}
        />
        <input
          className="p-2 bg-zinc-200 rounded"
          placeholder="price"
          ref={priceRef}
          type="number"
        />
      </div>
      <button
        onClick={() => {
          console.log(nameRef.current?.value);
          console.log(descRef.current?.value);
          console.log(priceRef.current?.valueAsNumber);
          if (
            nameRef.current?.value &&
            descRef.current?.value &&
            priceRef.current?.valueAsNumber
          ) {
            console.log("dispatching...");
            dispatch(
              addItem({
                name: nameRef.current.value,
                description: descRef.current?.value,
                price: priceRef.current.valueAsNumber,
                id: window.crypto.randomUUID(),
              }),
            );
          }
          setParams("");
        }}
      >
        Add
      </button>
    </ModalWrapper>
  );
}

function AddProductModal() {
  return createPortal(<AddProduct />, document.getElementById("modal")!);
}

export default AddProductModal;
