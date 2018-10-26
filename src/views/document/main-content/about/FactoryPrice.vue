<template>
  <article>
    <h1>Factory Price</h1>
    <section>
      <h2>Factory Price</h2>
      <p>Club Factory is a direct-from-factory platform. Our technology innovation on the supply chain enables us to offer you the best prices by connecting you with factories from all around the world.</p>
      <img :src="factoryPriceImg" alt="factory price" width="960px">
    </section>
    <section>
      <h2>Our Advantages</h2>
      <h3>1. Factory Prices</h3>
      <p>Our technology bypasses distributors and lowers prices you find on eBay and Amazon by 30%-40%</p>
      <h3>2. Premium Products</h3>
      <p>You could find trendy products from every corner of the world on Club Factory with the help of our advanced technology.</p>
      <h3>3. Low Shipping Fees</h3>
      <p>Through Club Factory you can buy products from factories around the world. Multiple items, one package, one shipping fee. You would also enjoy free shipping on orders above a certain value.</p>
      <h3>4. Assured Quality</h3>
      <p>Our customer service team will communicate with factories on your behalf about whatever questions you may have with your order. We built a comprehensive quality control system to filter out factories that do not meet our standards.</p>
    </section>
  </article>
</template>

<script>
import factoryPrice from 'assets/image/factoryPrice.jpg'
export default {
  data () {
    return {
      factoryPriceImg: factoryPrice
    }
  }
}
</script>

<style scoped>
  h3 {
    font-weight: normal;
  }
</style>
