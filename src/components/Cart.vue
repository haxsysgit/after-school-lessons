<template>
  <div>
    <h3 class="mb-4">Shopping Cart</h3>
    <div v-if="cart.length === 0">No lessons added yet.</div>

    <ul class="list-group mb-4" v-else>
      <li class="list-group-item d-flex justify-content-between align-items-center"
          v-for="(item, index) in cart" :key="index">
        {{ item.subject }} - £{{ item.price }}
        <button class="btn btn-danger btn-sm" @click="$emit('remove-from-cart', index)">
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: ['cart']
}
</script>
