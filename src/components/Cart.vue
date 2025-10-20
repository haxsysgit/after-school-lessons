<template>
  <div>
    <h4 class="mb-3"><i class="fas fa-shopping-cart me-2"></i>Your Cart</h4>

    <div v-if="cart.length === 0" class="text-muted py-4 text-center">
      <i class="fas fa-box-open fa-2x mb-2"></i>
      <div>No lessons added yet.</div>
    </div>

    <div v-else>
      <ul class="list-group mb-3">
        <li
          v-for="(item, index) in cart"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <div class="fw-semibold">{{ item.subject }}</div>
            <small class="text-muted">{{ item.location }}</small>
          </div>

          <div class="text-end">
            <div class="fw-bold">£{{ item.price }}</div>
            <button
              class="btn btn-outline-danger btn-sm mt-2"
              @click="$emit('remove-from-cart', index)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>

      <!-- Total field (always visible when there are items) -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="text-muted">Total</div>
        <div class="fw-bold">£{{ total }}</div>
      </div>

      <!-- small action buttons (App.vue already has footer actions too) -->

    </div>
  </div>
</template>

<script>
export default {
  name: "Cart",
  props: ["cart"],
  computed: {
    total() {
      return this.cart.reduce((s, it) => s + (Number(it.price) || 0), 0);
    }
  }
};
</script>

<style scoped>
.list-group-item {
  border: none;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
</style>
