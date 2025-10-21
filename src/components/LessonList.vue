<template>
  <div class="container my-4">
    <h2 class="text-center mb-4">Available Lessons</h2>

    <!-- Search and Sort Controls -->
    <div class="d-flex flex-column flex-md-row justify-content-between mb-4 gap-2">
      <input
        type="text"
        class="form-control"
        placeholder="Search lessons..."
        v-model="searchQuery"
      />
      <select class="form-select w-md-auto" v-model="sortKey">
        <option value="">Sort By</option>
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Spaces</option>
      </select>
      <select class="form-select w-md-auto" v-model="sortOrder">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div class="row justify-content-center">
      <div
        v-for="lesson in filteredAndSortedLessons"
        :key="lesson.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
      >
        <div class="card lesson-card h-100">
          <img :src="lesson.image" class="card-img-top lesson-thumb" :alt="lesson.subject" />

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
              class="btn mt-auto w-100"
              :class="lesson.spaces === 0 ? 'btn-secondary disabled' : 'btn-outline-primary'"
              @click="$emit('add-to-cart', lesson)"
              :disabled="lesson.spaces === 0"
            >
              <i class="fas fa-cart-plus me-2"></i>
              {{ lesson.spaces === 0 ? 'Full' : 'Add to Cart' }}
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
  props: ["lessons"],
  data() {
    return {
      searchQuery: "",
      sortKey: "",
      sortOrder: "asc",
    };
  },
  computed: {
    filteredAndSortedLessons() {
      let result = this.lessons.filter((lesson) => {
        const q = this.searchQuery.toLowerCase();
        return (
          lesson.subject.toLowerCase().includes(q) ||
          lesson.location.toLowerCase().includes(q) ||
          String(lesson.price).includes(q) ||
          String(lesson.spaces).includes(q)
        );
      });

      if (this.sortKey) {
        result.sort((a, b) => {
          let valA = a[this.sortKey];
          let valB = b[this.sortKey];

          // Handle string comparison
          if (typeof valA === "string") valA = valA.toLowerCase();
          if (typeof valB === "string") valB = valB.toLowerCase();

          if (valA < valB) return this.sortOrder === "asc" ? -1 : 1;
          if (valA > valB) return this.sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      return result;
    },
  },
};
</script>

<style scoped>
.lesson-thumb {
  width: 100%;
  height: 150px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.card {
  border-radius: 12px;
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-4px);
}
.lesson-description {
  font-size: 0.9rem;
  color: #555;
  flex-grow: 1;
}
</style>
