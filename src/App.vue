<template>

    <div class="container py-4">
      <!-- Header -->
      <header class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-primary">After School Lessons</h1>

        <!-- Cart button shows item count and toggles the side panel -->
        <button class="btn btn-outline-primary position-relative" @click="openCart">
          <i class="fas fa-shopping-cart"></i>
          <span
            class="badge bg-primary position-absolute top-0 start-100 translate-middle"
            >{{ cart.length }}</span
          >
        </button>
      </header>

      <!-- Lesson list (main page content) -->
      <LessonList :lessons="lessons" @add-to-cart="addToCart" />
    </div>

    <!-- Sidebar cart -->
    <div
      :class="['cart-sidebar', showSidebar ? 'open' : '']"
      @keydown.esc="closeCart"
      tabindex="0"
    >
      <div
        class="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom bg-light"
      >
        <h5 class="mb-0">Your Cart</h5>
        <button class="btn btn-sm btn-light" @click="closeCart">&times;</button>
      </div>

      <div class="sidebar-body p-3">
        <Cart
          :cart="cart"
          @remove-from-cart="removeFromCart"
          @start-checkout="startCheckout"
        />
      </div>

      <div class="sidebar-footer p-3 border-top bg-light">
        <div class="d-grid gap-2">

        <button class="btn btn-success" :disabled="cart.length === 0" @click="submitOrder">
          <i class="fas fa-credit-card me-1"></i> 

          Checkout

        </button>

        <button class="btn btn-outline-secondary" @click="closeCart">
          <i class="fas fa-arrow-left me-1"></i> 

          Continue Shopping
        </button>

        

      </div>
      </div>
    </div>

    <!-- Backdrop overlay -->
    <div v-if="showSidebar" class="sidebar-backdrop" @click="closeCart"></div>

</template>

<script>
import lessons from "./data/lessons";
import LessonList from "./components/LessonList.vue";
import Cart from "./components/Cart.vue";

export default {
  name: "App",
  components: { LessonList, Cart },

  data() {
    return {
      showSidebar: false,
      cart: [],
      lessons,
    };
  },

  methods: {
    openCart() {
      this.showSidebar = true;
      this.$nextTick(() => {
        const el = document.querySelector(".cart-sidebar");
        if (el) el.focus();
      });
    },

    closeCart() {
      this.showSidebar = false;
    },
    
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces--;

        this.cart.push({
          id: lesson.id,
          subject: lesson.subject,
          price: lesson.price,
          location: lesson.location,
        });
      }
    },

    removeFromCart(index) {
      const removed = this.cart.splice(index, 1)[0];
      const original = this.lessons.find((l) => l.id === removed.id);
      if (original) original.spaces++;
    },

    startCheckout() {
      const footerBtn = document.querySelector(".sidebar-footer .btn-success");
      if (footerBtn) footerBtn.focus();
    },

    submitOrder() {
      alert(`Order submitted for ${this.cart.length} item(s). Thank you!`);
      this.cart = [];
      this.closeCart();
    },
  },
};
</script>

