<template>
  <div class="app-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <header class="header">
          <div class="header-content">
            <div class="logo-section">
              <div class="logo-icon">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <div class="logo-text">
                <h1 class="main-title">After School Lessons</h1>
                <p class="subtitle">Discover, Learn, and Excel</p>
              </div>
            </div>
            <button
              class="cart-button ripple interactive"
              @click="toggleCart"
              :class="{ 'cart-pulse': cart.length > 0 }"
              :disabled="cart.length === 0"
            >
              <i class="fas fa-shopping-cart"></i>
              <span class="cart-text">Cart</span>
              <span class="badge bg-primary bounce" v-if="cart.length > 0">{{ cart.length }}</span>
            </button>
          </div>
        </header>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <LessonList :lessons="lessons" :baseUrl="baseUrl" :loading="isLoading" @add-to-cart="addToCart" />
      </div>
    </div>

    <!-- Sidebar -->
    <div :class="['cart-sidebar', showSidebar ? 'open' : '', 'slide-in-right']" tabindex="0">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <i class="fas fa-shopping-cart me-2"></i>
          <h5 class="mb-0">Your Cart</h5>
        </div>
        <button class="close-btn ripple interactive" @click="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="sidebar-body">
        <!-- CART -->
        <Cart v-if="sidebarMode==='cart'" :cart-items="cart" @remove-from-cart="removeFromCart" />

        <!-- ORDER PREVIEW -->
        <div v-if="sidebarMode==='preview'" class="order-preview">
          <div class="preview-header">
            <h5><i class="fas fa-receipt me-2"></i>Order Summary</h5>
          </div>
          <div class="order-items">
            <div v-for="item in cart" :key="item.id" class="order-item">
              <div class="item-info">
                <span class="item-name">{{ item.subject }}</span>
                <span class="item-location">{{ item.location }}</span>
              </div>
              <span class="item-price">£{{ item.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-total">
            <div class="total-line">
              <span>Total:</span>
              <span class="total-amount">£{{ total.toFixed(2) }}</span>
            </div>
          </div>
          <div class="preview-actions">
            <button class="btn btn-success w-100" @click="sidebarMode='form'">
              <i class="fas fa-check me-2"></i>Confirm Order
            </button>
            <button class="btn btn-outline-secondary w-100 mt-2" @click="sidebarMode='cart'">
              <i class="fas fa-arrow-left me-2"></i>Back to Cart
            </button>
          </div>
        </div>

        <!-- CHECKOUT FORM -->
        <CheckoutForm v-if="sidebarMode==='form'" :cart-items="cart" @checkout="handleCheckout" />

        <!-- SUCCESS -->
        <div v-if="sidebarMode==='success'" class="success-message scale-in">
          <div class="success-icon bounce">
            <i class="fas fa-check-circle"></i>
          </div>
          <h5>Order Placed Successfully! 🎉</h5>
          <div class="order-details fade-in">
            <p><strong>Name:</strong> {{ lastOrder.name }}</p>
            <p><strong>Items:</strong> {{ lastOrder.items.length }}</p>
            <p><strong>Total:</strong> £{{ displayTotal.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="btn btn-outline-secondary w-100" @click="closeSidebar">
          <i class="fas fa-arrow-left me-2"></i>
          Continue Shopping
        </button>
        <button v-if="sidebarMode==='cart' && cart.length>0" class="btn btn-success w-100 mt-2" @click="sidebarMode='preview'">
          <i class="fas fa-credit-card me-2"></i>
          Proceed to Checkout
        </button>
      </div>
    </div>

    <div v-if="showSidebar" class="sidebar-backdrop" @click="closeSidebar"></div>
  </div>
</template>



<script>
import LessonList from "./components/LessonList.vue";
import Cart from "./components/Cart.vue";
import CheckoutForm from "./components/CheckoutForm.vue";

const BASE_URL = 'https://express-coursework-backend.onrender.com';

// Root app orchestrates data flow between lesson list, cart, and checkout sidebar
export default {
  name: "App",
  components: { LessonList, Cart, CheckoutForm },
  data() {
    return {
      // Controls cart sidebar visibility and mode
      showSidebar: false,
      sidebarMode: 'cart', // cart | preview | form | success

      // In-memory lesson data and shopping cart
      lessons: [],
      isLoading: true,
      cart: [],

      // Stores last successful order for confirmation view
      lastOrder: null,
      lastTotal: 0,
      baseUrl: BASE_URL
    };
  },
  mounted() {
    this.loadLessons();
  },
  computed: {
    // Derived total price from cart items
    total() {
      return this.cart.reduce((sum, x) => sum + x.price, 0);
    },
    displayTotal() {
      return this.lastOrder ? this.lastTotal : this.total;
    }
  },
  methods: {
    async loadLessons() {
      this.isLoading = true;
      try {
        const res = await fetch(`${BASE_URL}/lessons`);
        const data = await res.json();
        this.lessons = (Array.isArray(data) ? data : []).map(l => ({
          id: l._id,
          subject: l.topic,
          location: l.location,
          price: Number(l.price),
          spaces: Number(l.space),
          image: l.image && l.image.startsWith('/imgs') ? `${BASE_URL}${l.image}` : l.image
        }));
      } catch (e) {
        // ignore fetch failures; UI can still function with empty list
      } finally {
        this.isLoading = false;
      }
    },
    // Toggle cart sidebar visibility
    toggleCart() {
      this.showSidebar = !this.showSidebar;
    },
    // Close sidebar and reset mode after success
    closeSidebar() {
      this.showSidebar = false;
      if (this.sidebarMode === 'success') this.sidebarMode = 'cart';
    },
    // Add one item to cart and decrement spaces on the lesson
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces--;
        this.cart.push({ id: lesson.id, subject: lesson.subject, price: lesson.price, location: lesson.location });

        // Visual feedback on cart button
        this.$nextTick(() => {
          const cartButton = document.querySelector('.cart-button');
          if (cartButton) {
            cartButton.classList.add('bounce');
            setTimeout(() => cartButton.classList.remove('bounce'), 1000);
          }
        });
      }
    },
    // Remove item from cart and restore a space to the original lesson
    removeFromCart(index) {
      const removed = this.cart.splice(index, 1)[0];
      const original = this.lessons.find(l => l.id === removed.id);
      if (original) original.spaces++;
    },
    // Handle successful checkout: store order, clear cart, show success state
    handleCheckout(order) {
      this.lastTotal = this.total;
      this.lastOrder = order;
      this.cart = [];
      this.sidebarMode = 'success';
    }
  }
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: transparent;
}

.hero-section {
  background: var(--gradient-primary);
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header {
  position: relative;
  z-index: 2;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.main-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
  font-weight: 300;
}

.cart-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.cart-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.cart-button:hover::before {
  left: 100%;
}

.cart-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.cart-pulse {
  animation: pulse 2s infinite;
}

.cart-button:active {
  transform: scale(0.95);
}

.cart-text {
  font-size: 0.9rem;
}

.main-content {
  background: var(--light-bg);
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

/* Sidebar Styles */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--gradient-primary);
  color: white;
}

.sidebar-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.sidebar-body {
  padding: 1.5rem;
  background: var(--light-bg);
  flex: 1;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 1.5rem;
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
}

/* Order Preview Styles */
.order-preview {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.preview-header h5 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.order-items {
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  color: var(--text-primary);
}

.item-location {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
}

.order-total {
  background: var(--light-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.total-amount {
  color: var(--primary-color);
  font-size: 1.2rem;
}

/* Success Message Styles */
.success-message {
  text-align: center;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.success-icon {
  font-size: 3rem;
  color: var(--success-color);
  margin-bottom: 1rem;
}

.success-message h5 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.order-details {
  background: var(--light-bg);
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
}

.order-details p {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .logo-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .cart-button {
    padding: 10px 16px;
  }
  
  .cart-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1.5rem 0;
  }
  
  .main-title {
    font-size: 1.8rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .logo-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
