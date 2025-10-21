<template>
  <div>
    <h5 class="mb-3">
      <i class="fa fa-shopping-cart text-primary me-2"></i> Your Cart
    </h5>

    <div v-if="cartItems.length === 0" class="text-muted text-center py-5">
      <i class="fa fa-box-open fa-2x mb-2"></i>
      <p>Your cart is empty</p>
    </div>

    <ul v-else class="list-group mb-3">
      <li
        v-for="(item, index) in cartItems"
        :key="item.id + '-' + index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ item.subject }}</strong>
          <div class="text-muted small">{{ item.location }}</div>
        </div>
        <div>
          <span class="me-2">£{{ item.price.toFixed(2) }}</span>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="$emit('remove-from-cart', index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </li>
    </ul>

    <div v-if="cartItems.length > 0" class="border-top pt-3">
      <h6 class="fw-bold text-end">Total: £{{ totalPrice.toFixed(2) }}</h6>
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
  }
};
</script>
