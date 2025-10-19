<template>
  <div class="container py-4">
    <!-- Header -->
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-primary">After School Lessons</h1>

      <!-- Cart button shows item count and toggles the side panel -->
      <button class="btn btn-outline-primary position-relative" @click="openCart">
        <i class="fas fa-shopping-cart"></i>
        <span class="badge bg-primary position-absolute top-0 start-100 translate-middle">{{ cart.length }}</span>
      </button>
    </header>

    <!-- Lesson list (main page content) -->
    <LessonList :lessons="lessons" @add-to-cart="addToCart" />

    <!-- Sidebar cart (hidden when showSidebar is false) -->
    <div :class="['cart-sidebar', showSidebar ? 'open' : '']" @keydown.esc="closeCart" tabindex="0">
      <div class="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 class="mb-0">Your Cart</h5>
        <button class="btn btn-sm btn-light" @click="closeCart">&times;</button>
      </div>

      <div class="sidebar-body p-3">
        <Cart :cart="cart" @remove-from-cart="removeFromCart" @start-checkout="startCheckout" />
      </div>

      <div class="sidebar-footer p-3 border-top">
        <div class="d-grid gap-2">
          <button class="btn btn-success" :disabled="cart.length === 0" @click="submitOrder">
            Checkout ({{ cart.length }} items)
          </button>
          <button class="btn btn-secondary" @click="closeCart">Continue Shopping</button>
        </div>
      </div>
    </div>

    <!-- Overlay behind the sidebar (click to close) -->
    <div v-if="showSidebar" class="sidebar-backdrop" @click="closeCart"></div>
  </div>
</template>

<script>
import lessons from './data/lessons';
import LessonList from './components/LessonList.vue'
import Cart from './components/Cart.vue'

export default {
  name: 'App',
  components: { LessonList, Cart },

  data() {
    return {
      showSidebar: false,   // controls whether cart sidebar is visible
      cart: [],             // items user added
      lessons
    }
  },

  methods: {
    openCart() {
      this.showSidebar = true
      // focus the sidebar for accessibility, optional
      this.$nextTick(() => {
        const el = document.querySelector('.cart-sidebar')
        if (el) el.focus()
      })
    },

    closeCart() {
      this.showSidebar = false
    },

    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces--
        // push a small object with necessary info (clone to avoid mutation oddities)
        this.cart.push({ id: lesson.id, subject: lesson.subject, price: lesson.price, location: lesson.location })
      }
    },

    removeFromCart(index) {
      // find the removed item
      const removed = this.cart.splice(index, 1)[0]
      // restore spaces on the original lesson
      const original = this.lessons.find(l => l.id === removed.id)
      if (original) original.spaces++
    },

    startCheckout() {
      // Could open a checkout view inside the sidebar.
      // For now just scroll to bottom or focus checkout button.
      const footerBtn = document.querySelector('.sidebar-footer .btn-success')
      if (footerBtn) footerBtn.focus()
    },

    submitOrder() {
      // For frontend-only flow: show confirmation and clear cart
      alert(`Order submitted for ${this.cart.length} item(s). Thank you!`)
      // In the backend stage we'll send a fetch POST to the server here.
      // Restore spaces (if you want to simulate server commit you would not restore)
      this.cart.forEach(c => {
        const original = this.lessons.find(l => l.id === c.id)
        if (original) {
          // spaces already decremented when added; we keep it decremented to reflect order
          // if you want to fully clear the cart and restore spaces on cancel, handle differently
        }
      })
      this.cart = []
      this.closeCart()
    }
  }
}
</script>

<style>
/* Sidebar base */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -420px;             /* hidden by default (off screen) */
  width: 380px;
  height: 100%;
  background: #fff;
  box-shadow: -6px 0 30px rgba(0,0,0,0.15);
  transition: right 0.25s ease;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  outline: none;             /* allow focus without visible outline */
}

/* When open, slide in */
.cart-sidebar.open {
  right: 0;
}

/* Make body behind slightly dim (backdrop) */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1040;
}

/* header/body/footer areas */
.sidebar-header { /* already uses bootstrap classes in template */ }
.sidebar-body { overflow-y: auto; flex: 1; }
.sidebar-footer { }
</style>
