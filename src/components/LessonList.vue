<template>
  <div class="container my-4">
    <h2 class="text-center mb-4">Available Lessons</h2>
    <div class="row justify-content-center">
      <div 
        v-for="lesson in lessons"
        :key="lesson.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
      >
        <div class="card lesson-card h-100">
          <img :src="lesson.image" class="card-img-top" alt="Lesson image" />

          <div class="card-body d-flex flex-column">

            <h5 class="card-title">{{ lesson.subject }}</h5>
            <p class="lesson-description">{{ lesson.description }}</p>
            <p class="card-text mb-1">
              <i class="fa-solid fa-location-dot text-primary me-2"></i>
              {{ lesson.location }}
            </p>
            <p class="card-text mb-1">
              <i class="fa-solid fa-tag text-success me-2"></i>
              ${{ lesson.price }}
            </p>
            <p class="card-text mb-3">
              <i class="fa-solid fa-user-group text-info me-2"></i>
              {{ lesson.spaces }} spaces left
            </p>
            <button 
              class="btn btn-outline-primary mt-auto w-100"
              @click="$emit('add-to-cart', lesson)"
            >
            <i class="fas fa-cart-plus me-2"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonList",
  props: ["lessons"]
};
</script>

<style scoped>
/* reduce image size to make cards smaller and consistent */
.lesson-thumb {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
.card {
  border-radius: 12px;
}
</style>
