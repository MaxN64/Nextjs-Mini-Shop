const fs = require('fs');
const path = require('path');
const https = require('https');
const productsData = require('../src/data/products.json');

// Создаем папки для изображений
const publicDir = path.join(__dirname, '../public');
const imagesDir = path.join(publicDir, 'images');
const productsDir = path.join(imagesDir, 'products');
const otherProductsDir = path.join(productsDir, 'otherProducts');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
if (!fs.existsSync(otherProductsDir)) fs.mkdirSync(otherProductsDir, { recursive: true });

// Функция для скачивания файла
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Собираем все URL изображений
const imageTasks = [];
const updatedProducts = {};

for (const key in productsData) {
  const product = productsData[key];
  const productId = product.id || key;
  
  updatedProducts[key] = { ...product };
  
  // Главное изображение
  if (product.img) {
    const ext = product.img.includes('.png') ? 'png' : 'jpg';
    const filename = `${productId}.${ext}`;
    const filepath = path.join(productsDir, filename);
    
    imageTasks.push({ url: product.img, filepath, filename });
    updatedProducts[key].img = `/images/products/${filename}`;
  }
  
  // Дополнительные изображения
  if (product.otherImgs && Array.isArray(product.otherImgs)) {
    updatedProducts[key].otherImgs = [];
    product.otherImgs.forEach((imgUrl, index) => {
      const ext = imgUrl.includes('.png') ? 'png' : imgUrl.includes('.webp') ? 'webp' : 'jpg';
      const filename = `${productId}_${index}.${ext}`;
      const filepath = path.join(otherProductsDir, filename);
      
      imageTasks.push({ url: imgUrl, filepath, filename });
      updatedProducts[key].otherImgs.push(`/images/products/otherProducts/${filename}`);
    });
  }
}

// Скачиваем все изображения
async function downloadAll() {
  console.log(`📥 Starting download of ${imageTasks.length} images...\n`);
  
  for (let i = 0; i < imageTasks.length; i++) {
    const task = imageTasks[i];
    try {
      await downloadFile(task.url, task.filepath);
    } catch (error) {
      console.error(`❌ Error downloading ${task.filename}:`, error.message);
    }
  }
  
  // Сохраняем обновленный JSON
  const outputPath = path.join(__dirname, '../src/data/products-local.json');
  fs.writeFileSync(outputPath, JSON.stringify(updatedProducts, null, 2));
  
  console.log(`\n✅ All images downloaded!`);
  console.log(`✅ Updated JSON saved to: ${outputPath}`);
  console.log(`\n⚠️  Next step: Update your code to use 'products-local.json'`);
  console.log(`   Files to update:`);
  console.log(`   - src/pages/index.js`);
  console.log(`   - src/pages/product/[id].js`);
  console.log(`   - src/pages/categories/[slug].js`);
}

downloadAll().catch(console.error);