<template>
  <div class="container py-4">
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-primary">After School Lessons</h1>
      <button class="btn btn-outline-primary" @click="toggleCart">
        <i class="fas fa-shopping-cart"></i>
        <span class="badge bg-primary">{{ cart.length }}</span>
      </button>
    </header>

    <LessonList v-if="!showCart" :lessons="lessons" @add-to-cart="addToCart" />
    <Cart v-else :cart="cart" @remove-from-cart="removeFromCart" />
  </div>
</template>

<script>
import LessonList from './components/LessonList.vue'
import Cart from './components/Cart.vue'

export default {
  name: 'App',
  components: { LessonList, Cart },

  data() {
    return {
      showCart: false,
      cart: [],
      lessons: [
        { id: 1, subject: 'Mathematics', location: 'London', price: 30, spaces: 5, image: 'https://cdn-icons-png.flaticon.com/512/3135/3135755.png' },
        { id: 2, subject: 'English', location: 'Bristol', price: 25, spaces: 5, image: 'https://cdn-icons-png.flaticon.com/512/3135/3135765.png' },
        { id: 3, subject: 'Art', location: 'Manchester', price: 20, spaces: 5, image: 'https://cdn-icons-png.flaticon.com/512/3135/3135783.png' },
      ]
    }
  },

  methods: {
    toggleCart() {
      this.showCart = !this.showCart
    },

    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces--
        this.cart.push({ ...lesson })
      }
    },

    removeFromCart(index) {
      const removed = this.cart.splice(index, 1)[0]
      const original = this.lessons.find(l => l.id === removed.id)
      if (original) original.spaces++
    }
  }
}
</script>
