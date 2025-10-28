import Banner from "@/components/Products/Banner";
import Hero from "@/components/Products/Hero";
import StarProducts from "@/components/Products/StarProducts";
import Trending from "@/components/Products/Trending";
import Banner1 from "../assets/banner/banner1.jpg";
import Banner2 from "../assets/banner/banner2.jpg";
import { useEffect, useState } from "react";
import productsData from '../data/products-local.json';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
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
    
    setProducts(loadedData);
  }, []);

  const starProducts = products.filter((item) => item.star);
  const trendProducts = products.filter((item) => item.trend);

  return (
    <>
      <Hero />
      <StarProducts items={starProducts} />
      <Banner
        type="normal"
        title="Creative harmonious living"
        text=" RAOUF Products are all made to standard sizes so that you can mix and match them freely."
        img={Banner1}
      />
      <Trending items={trendProducts} />
      <Banner
        type="reverse"
        title="Comfortable & Elegante Living"
        text=" RAOUF Products are all made to standard sizes so that you can mix and match them freely."
        img={Banner2}
      />
    </>
  );
};

export default HomePage;