import { useContext, useState } from "react";
import CartContext from "@/context/cart-context";
import ProductForm from "@/components/Products/ProductForm";
import ProductImgAlbum from "@/components/Products/ProductImgAlbum";
import Trending from "@/components/Products/Trending";
import Notification from "@/components/UI/Notification";
import styles from "@/styles/ProductPage.module.css";
import { FaAngleLeft } from "react-icons/fa";
import Link from "next/link";
import { Inter } from "next/font/google";
import productsData from '../../data/products-local.json';

const inter = Inter({ subsets: ["latin"] });

const ProductPage = (props) => {
  const { addItem } = useContext(CartContext);
  const [notify, setNotify] = useState(false);

  const amountHandler = (amount) => {
    addItem({
      id: props.item.id,
      name: props.item.description,
      amount: amount,
      price: props.item.price,
      img: props.item.img,
    });
    showNotify();
  };

  const showNotify = () => {
    setNotify(true);
    const timer = setTimeout(() => {
      setNotify(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  };

  return (
    <>
      {notify && (
        <Notification
          status={notify}
          message="✅ Item has been added to the cart"
        />
      )}
      <div className={`${styles.main} ${inter.className}`}>
        <div className={styles.title}>
          <Link href="/" className={styles.back}>
            <FaAngleLeft />
            <span>Back</span>
          </Link>
          <h3>{props.item.description}</h3>
        </div>
        <div className={styles.product}>
          <ProductImgAlbum
            mainImg={props.item.img}
            otherImgs={props.item.otherImgs}
          />
          <ProductForm onAddToCart={amountHandler} info={props.item} />
        </div>

        <div className={styles.specifications}>
          <div className={styles.spec}>
            <p className={styles.specTitle}>Texture:</p>
            <p className={styles.desc}>{props.item.texture}</p>
          </div>
          <div className={styles.spec}>
            <p className={styles.specTitle}>Weight:</p>
            <p className={styles.desc}>{props.item.weight}</p>
          </div>
          <div className={styles.spec}>
            <p className={styles.specTitle}>Size:</p>
            <p className={styles.desc}>{props.item.size}</p>
          </div>
        </div>

        <Trending items={props.products.filter((item) => item.trend)} />
      </div>
    </>
  );
};
export default ProductPage;

export async function getStaticPaths() {
  const loadedData = [];

  for (const key in productsData) {
    loadedData.push({
      id: productsData[key].id,
    });
  }

  const paths = loadedData.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps(context) {
  const productId = context.params.id;

  const loadedData = [];
  for (const key in productsData) {
    loadedData.push({
      id: key,
      category: productsData[key].category,
      path: productsData[key].id,
      img: productsData[key].img,
      description: productsData[key].description,
      price: productsData[key].price,
      otherImgs: productsData[key].otherImgs,
      specs: productsData[key].specs,
      texture: productsData[key].texture,
      weight: productsData[key].weight,
      size: productsData[key].size,
      star: productsData[key].star,
      trend: productsData[key].trend,
    });
  }

  const selectedItem = loadedData.filter(
    (product) => product.path == productId
  );

  return {
    props: {
      products: loadedData,
      item: selectedItem[0],
    },
  };
}