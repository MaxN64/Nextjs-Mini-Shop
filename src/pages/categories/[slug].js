import { useRouter } from "next/router";
import styles from "@/styles/CategoriesPage.module.css";
import { Inter } from "next/font/google";
import Categories from "@/components/Products/Categories";
import Post from "@/components/Products/Post";
import productsData from '../../data/products-local.json';

const inter = Inter({ subsets: ["latin"] });

const Product = (props) => {
  const router = useRouter();
  const { slug } = router.query;
  const filteredItems = props.products.filter((item) =>
    slug === "all" ? item : item.category === slug
  );
  return (
    <div className={`${styles.mainContainer} ${inter.className}`}>
      <Categories />
      <ul className={styles.grid}>
        {filteredItems.map((item) => (
          <li key={item.id}>
            <Post {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Product;

export async function getStaticPaths() {
  const loadedData = [];

  for (const key in productsData) {
    loadedData.push({
      id: productsData[key].id,
    });
  }

  const paths = loadedData.map((post) => ({
    params: { slug: post.id },
  }));

  return {
    paths: [...paths, { params: { slug: "all" } }],
    fallback: "blocking",
  };
}

export async function getStaticProps() {
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

  return {
    props: {
      products: loadedData,
    },
  };
}