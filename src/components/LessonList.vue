<template>
  <div class="lesson-list-container">
    <!-- Header Section -->
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <i class="fas fa-book-open me-2"></i>
          Available Lessons
        </h2>
        <p class="section-subtitle">Discover amazing learning opportunities</p>
      </div>
    </div>

    <!-- Search and Filter Controls -->
    <div class="controls-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            class="search-input"
            placeholder="Search lessons by subject, location, or price..."
            v-model="searchQuery"
          />
        </div>
      </div>
      
      <div class="filter-controls">
        <div class="filter-group">
          <label class="filter-label">Sort By</label>
          <select class="filter-select" v-model="sortKey">
            <option value="">Choose...</option>
            <option value="subject">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">Available Spaces</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Order</label>
          <select class="filter-select" v-model="sortOrder">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lessons Grid -->
    <div class="lessons-grid">
      <div
        v-for="lesson in filteredAndSortedLessons"
        :key="lesson.id"
        class="lesson-card-wrapper"
        :data-lesson-id="lesson.id"
      >
        <div class="lesson-card card-hover interactive" :class="{ 'fade-in': true }">
          <div class="card-image-container">
            <img :src="lesson.image" class="card-image" :alt="lesson.subject" />
            <div class="card-overlay">
              <div class="price-badge scale-in">£{{ lesson.price }}</div>
            </div>
          </div>

          <div class="card-content">
            <div class="card-header">
              <h3 class="lesson-title">{{ lesson.subject }}</h3>
              <p class="lesson-description">{{ lesson.description }}</p>
            </div>

            <div class="lesson-details">
              <div class="detail-item">
                <i class="fas fa-map-marker-alt detail-icon"></i>
                <span class="detail-text">{{ lesson.location }}</span>
              </div>
              
              <div class="detail-item">
                <i class="fas fa-users detail-icon"></i>
                <span class="detail-text">{{ lesson.spaces }} spaces left</span>
              </div>
            </div>

            <div class="card-footer">
              <button
                class="add-to-cart-btn ripple interactive"
                :class="lesson.spaces === 0 ? 'disabled' : ''"
                @click="handleAddToCart(lesson)"
                :disabled="lesson.spaces === 0"
              >
                <i class="fas fa-cart-plus me-2" :class="{ 'spinner': addingToCart === lesson.id }"></i>
                {{ lesson.spaces === 0 ? 'Fully Booked' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredAndSortedLessons.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-search"></i>
      </div>
      <h3>No lessons found</h3>
      <p>Try adjusting your search criteria or filters</p>
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
      addingToCart: null,
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
  methods: {
    handleAddToCart(lesson) {
      if (lesson.spaces > 0) {
        this.addingToCart = lesson.id;
        
        // Simulate loading state
        setTimeout(() => {
          this.$emit('add-to-cart', lesson);
          this.addingToCart = null;
          
          // Add success feedback
          const button = document.querySelector(`[data-lesson-id="${lesson.id}"] .add-to-cart-btn`);
          if (button) {
            button.classList.add('bounce');
            setTimeout(() => button.classList.remove('bounce'), 1000);
          }
        }, 500);
      }
    }
  },
};
</script>

<style scoped>
.lesson-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Section */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Controls Section */
.controls-section {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  font-size: 1rem;
  background: var(--light-bg);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: var(--card-bg);
}

.filter-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--light-bg);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Lessons Grid */
.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.lesson-card-wrapper {
  display: flex;
}

.lesson-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.lesson-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lesson-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.lesson-card:hover::before {
  opacity: 1;
}

.card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--light-bg);
  padding: 1rem;
  transition: transform 0.3s ease;
}

.lesson-card:hover .card-image {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.price-badge {
  background: var(--gradient-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: var(--shadow-md);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-header {
  margin-bottom: 1rem;
}

.lesson-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.lesson-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.lesson-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.detail-icon {
  color: var(--primary-color);
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
}

.detail-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.card-footer {
  margin-top: auto;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.add-to-cart-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.add-to-cart-btn:hover::before {
  left: 100%;
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.add-to-cart-btn.disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.add-to-cart-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .controls-section {
    padding: 1.5rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-group {
    width: 100%;
    max-width: 300px;
  }
  
  .lessons-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .card-content {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .lesson-list-container {
    padding: 0 0.5rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .controls-section {
    padding: 1rem;
  }
  
  .search-input {
    padding: 0.875rem 0.875rem 0.875rem 2.5rem;
  }
  
  .card-image-container {
    height: 160px;
  }
}
</style>
