<template>
  <div class="cart-container">
    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-cart-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <h4>Your cart is empty</h4>
      <p>Add some lessons to get started!</p>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div
          v-for="(item, index) in cartItems"
          :key="item.id + '-' + index"
          class="cart-item fade-in"
          :style="{ 'animation-delay': `${index * 0.1}s` }"
        >
          <div class="item-info">
            <h6 class="item-title">{{ item.subject }}</h6>
            <p class="item-location">
              <i class="fas fa-map-marker-alt me-1"></i>
              {{ item.location }}
            </p>
          </div>
          <div class="item-actions">
            <span class="item-price">£{{ item.price.toFixed(2) }}</span>
            <button
              class="remove-btn ripple interactive"
              @click="handleRemove(index)"
              title="Remove item"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-line">
          <span>Subtotal:</span>
          <span>£{{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-line total">
          <span>Total:</span>
          <span>£{{ totalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cart",
  props: {
    cartItems: { type: Array, required: true }
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + item.price, 0);
    }
  },
  methods: {
    handleRemove(index) {
      // Add visual feedback
      const cartItem = document.querySelectorAll('.cart-item')[index];
      if (cartItem) {
        cartItem.classList.add('shake');
        setTimeout(() => {
          cartItem.classList.remove('shake');
          this.$emit('remove-from-cart', index);
        }, 500);
      } else {
        this.$emit('remove-from-cart', index);
      }
    }
  }
};
</script>

<style scoped>
.cart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Empty Cart State */
.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-cart-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-cart h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.empty-cart p {
  margin: 0;
  font-size: 0.9rem;
}

/* Cart Content */
.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cart-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cart-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.cart-item:hover::before {
  opacity: 1;
}

.item-info {
  flex: 1;
  margin-right: 1rem;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.item-location {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  display: flex;
  align-items: center;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 1rem;
}

.remove-btn {
  background: var(--danger-color);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

/* Cart Summary */
.cart-summary {
  background: var(--light-bg);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  margin-top: auto;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.summary-line.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  margin-bottom: 0;
}

.summary-line.total span:last-child {
  color: var(--primary-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .cart-item {
    padding: 0.875rem;
  }
  
  .item-title {
    font-size: 0.9rem;
  }
  
  .item-location {
    font-size: 0.8rem;
  }
  
  .item-price {
    font-size: 0.9rem;
  }
  
  .remove-btn {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .empty-cart {
    padding: 2rem 1rem;
  }
  
  .empty-cart-icon {
    font-size: 2.5rem;
  }
  
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .item-info {
    margin-right: 0;
    width: 100%;
  }
  
  .item-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
