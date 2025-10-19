<template>
  <div class="row">
    <div class="col-md-4 mb-4" v-for="lesson in lessons" :key="lesson.id">
      <div class="card h-100 shadow-sm">
        <img :src="lesson.image" class="card-img-top" alt="lesson image">
        <div class="card-body">
          <h5 class="card-title">{{ lesson.subject }}</h5>
          <p class="card-text">📍 {{ lesson.location }}</p>
          <p class="card-text fw-bold">£{{ lesson.price }}</p>
          <p class="text-muted">Spaces: {{ lesson.spaces }}</p>
          <button 
            class="btn btn-primary w-100"
            :disabled="lesson.spaces === 0"
            @click="$emit('add-to-cart', lesson)">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonList',
  props: ['lessons']
}
</script>
