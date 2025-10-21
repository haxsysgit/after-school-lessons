<template>
  <div class="container py-4">
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-primary">After School Lessons</h1>
      <button class="btn btn-outline-primary position-relative" @click="showSidebar = true">
        <i class="fas fa-shopping-cart"></i>
        <span class="badge bg-primary position-absolute top-0 start-100 translate-middle">{{ cart.length }}</span>
      </button>
    </header>

    <LessonList :lessons="lessons" @add-to-cart="addToCart" />
  </div>

  <!-- Sidebar -->
  <div :class="['cart-sidebar', showSidebar ? 'open' : '']" tabindex="0">
    <div class="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
      <h5 class="mb-0">Your Cart</h5>
      <button class="btn btn-sm btn-light" @click="closeSidebar">&times;</button>
    </div>

    <div class="sidebar-body p-3">
      <!-- CART -->
      <Cart v-if="sidebarMode==='cart'" :cart-items="cart" @remove-from-cart="removeFromCart" />

      <!-- ORDER PREVIEW -->
      <div v-if="sidebarMode==='preview'">
        <h5>Order Summary</h5>
        <ul class="list-group mb-3">
          <li v-for="item in cart" :key="item.id" class="list-group-item d-flex justify-content-between">
            <span>{{ item.subject }}</span>
            <span>£{{ item.price.toFixed(2) }}</span>
          </li>
        </ul>
        <p class="fw-bold text-end">Total: £{{ total.toFixed(2) }}</p>
        <button class="btn btn-success w-100" @click="sidebarMode='form'">Confirm</button>
        <button class="btn btn-outline-secondary w-100 mt-2" @click="sidebarMode='cart'">Back to Cart</button>
      </div>

      <!-- CHECKOUT FORM -->
      <CheckoutForm v-if="sidebarMode==='form'" :cart-items="cart" @checkout="handleCheckout" />

      <!-- SUCCESS -->
      <div v-if="sidebarMode==='success'" class="alert alert-success">
        <h5>Order Placed 🎉</h5>
        <p><strong>Name:</strong> {{ lastOrder.name }}</p>
        <p><strong>Items:</strong> {{ lastOrder.items.length }}</p>
        <p><strong>Total:</strong> £{{ total.toFixed(2) }}</p>
      </div>
    </div>

    <div class="sidebar-footer p-3 border-top bg-light">
      <button class="btn btn-outline-secondary w-100" @click="closeSidebar">
        <i class="fas fa-arrow-left me-1"></i>
        Continue Shopping</button>
      <button v-if="sidebarMode==='cart' && cart.length>0" class="btn btn-success w-100 mt-2" @click="sidebarMode='preview'">
        <i class="fas fa-credit-card me-1"></i>
        Checkout
      </button>
    </div>
  </div>

  <div v-if="showSidebar" class="sidebar-backdrop" @click="closeSidebar"></div>
</template>



<script>
import lessons from "./data/lessons";
import LessonList from "./components/LessonList.vue";
import Cart from "./components/Cart.vue";
import CheckoutForm from "./components/CheckoutForm.vue";


export default {
  name: "App",
  components: { LessonList, Cart, CheckoutForm },
  data() {
    return {
      showSidebar: false,
      cart: [],
      lessons,
      sidebarMode: 'cart', // cart | preview | form | success
      lastOrder: null
    };
  },
  computed: {
    total() {
      return this.cart.reduce((sum, x) => sum + x.price, 0);
    }
  },
  methods: {
    closeSidebar() {
      this.showSidebar = false;
      if(this.sidebarMode==='success') this.sidebarMode='cart';
    },
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces--;
        this.cart.push({ id: lesson.id, subject: lesson.subject, price: lesson.price, location: lesson.location });
      }
    },
    removeFromCart(index) {
      const removed = this.cart.splice(index,1)[0];
      const original = this.lessons.find(l => l.id===removed.id);
      if(original) original.spaces++;
    },
    handleCheckout(order) {
      this.lastOrder = order;
      this.cart = [];
      this.sidebarMode='success';
    }
  }
};
</script>
