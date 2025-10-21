<template>
  <div class="app-container">
    <LessonList
      :lessons="lessons"
      @addToCart="addToCart"
    />

    <Cart
      :cart="cart"
      v-if="showCart"
      @remove="removeFromCart"
      @closeCart="toggleCart"
      @checkout="handleCheckout"
    />

    
    <!-- Checkout Success Modal -->
    <div
      class="modal fade show"
      tabindex="-1"
      v-if="orderSuccess"
      style="display: block; background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Order Successful 🎉</h5>
            <button type="button" class="btn-close" @click="orderSuccess = false"></button>
          </div>
          <div class="modal-body">
            <p>Thank you, <strong>{{ lastOrder.name }}</strong>!</p>
            <p>Your order for <strong>{{ lastOrder.cart.length }}</strong> lessons has been confirmed.</p>
            <p><strong>Total:</strong> ₦{{ lastOrder.total }}</p>
            <p>Payment Method: {{ lastOrder.payment }}</p>
            <small class="text-muted">A confirmation email will be sent to {{ lastOrder.email }}.</small>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" @click="orderSuccess = false">OK</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Cart Button -->
    <button
      class="btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle"
      @click="toggleCart"
      style="width: 60px; height: 60px;"
    >
      <i class="fa fa-shopping-cart"></i>
      <span v-if="cart.length" class="badge bg-danger position-absolute top-0 start-100 translate-middle">
        {{ cart.length }}
      </span>
    </button>
  </div>
</template>

<script>
import LessonList from './components/LessonList.vue';
import Cart from './components/Cart.vue';
import lessonsData from './data/lessons.js';

export default {
  components: { LessonList, Cart },
  data() {
    return {
      lessons: lessonsData,
      cart: [],
      showCart: false,
      orderSuccess: false,
      lastOrder: null,
    };
  },
  methods: {
    addToCart(lesson) {
      this.cart.push(lesson);
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    toggleCart() {
      this.showCart = !this.showCart;
    },
    handleCheckout(order) {
      this.lastOrder = order;
      this.cart = [];
      this.showCart = false;
      this.orderSuccess = true;
    },
  },
};
</script>
