<template>
  <form @submit.prevent="submit">
    <h4>Checkout</h4>

    <div class="mb-3">
      <label class="form-label">Name</label>
      <input v-model="name" type="text" class="form-control" required />
    </div>

    <div class="mb-3">
      <label class="form-label">Phone</label>
      <input v-model="phone" type="tel" class="form-control" required />
    </div>

    <div class="mb-3">
      <label class="form-label">Payment Method</label>
      <select v-model="payment" class="form-select" required>
        <option value="card">Card</option>
        <option value="paypal">PayPal</option>
        <option value="cash">Cash</option>
      </select>
    </div>

    <button class="btn btn-primary w-100" type="submit">Place Order</button>
  </form>
</template>




<script>
export default {
  name: "CheckoutForm",
  props: {
    cartItems: { type: Array, required: true }
  },
  data() {
    return {
      name: "",
      phone: "",
      payment: "card"
    };
  },
  methods: {
    submit() {
      const order = {
        name: this.name,
        phone: this.phone,
        payment: this.payment,
        items: this.cartItems
      };
      this.$emit("checkout", order);
      this.name = "";
      this.phone = "";
      this.payment = "card";
    }

  }
};
</script>
