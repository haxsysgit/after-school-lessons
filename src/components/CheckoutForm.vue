<template>
  <div class="checkout-form">
    <div class="form-header">
      <h4>
        <i class="fas fa-credit-card me-2"></i>
        Checkout Details
      </h4>
      <p class="form-subtitle">Complete your order</p>
    </div>

    <form @submit.prevent="submit" class="checkout-form-content">
      <div class="form-section">
        <h5 class="section-title">
          <i class="fas fa-user me-2"></i>
          Personal Information
        </h5>
        
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <div class="input-wrapper">
            <i class="fas fa-user input-icon" :class="{ 'pulse': nameError }"></i>
            <input 
              v-model="name" 
              type="text" 
              class="form-input interactive" 
              :class="{ 'shake': nameError }"
              placeholder="Enter your full name"
              @input="validateName"
              required 
            />
            <div v-if="nameError" class="error-message fade-in">{{ nameError }}</div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <div class="input-wrapper">
            <i class="fas fa-phone input-icon" :class="{ 'pulse': phoneError }"></i>
            <input 
              v-model="phone" 
              type="tel" 
              class="form-input interactive" 
              :class="{ 'shake': phoneError }"
              placeholder="Enter your phone number"
              @input="validatePhone"
              required 
            />
            <div v-if="phoneError" class="error-message fade-in">{{ phoneError }}</div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h5 class="section-title">
          <i class="fas fa-credit-card me-2"></i>
          Payment Method
        </h5>
        
        <div class="form-group">
          <label class="form-label">Choose Payment Method</label>
          <div class="payment-options">
            <label class="payment-option" :class="{ active: payment === 'card' }">
              <input 
                v-model="payment" 
                type="radio" 
                value="card" 
                class="payment-radio"
                required 
              />
              <div class="payment-content">
                <i class="fas fa-credit-card"></i>
                <span>Credit/Debit Card</span>
              </div>
            </label>
            
            <label class="payment-option" :class="{ active: payment === 'paypal' }">
              <input 
                v-model="payment" 
                type="radio" 
                value="paypal" 
                class="payment-radio"
              />
              <div class="payment-content">
                <i class="fab fa-paypal"></i>
                <span>PayPal</span>
              </div>
            </label>
            
            <label class="payment-option" :class="{ active: payment === 'cash' }">
              <input 
                v-model="payment" 
                type="radio" 
                value="cash" 
                class="payment-radio"
              />
              <div class="payment-content">
                <i class="fas fa-money-bill-wave"></i>
                <span>Cash on Delivery</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="submit-btn ripple interactive" type="submit" :disabled="!isFormValid">
          <i class="fas fa-check me-2" :class="{ 'spinner': isSubmitting }"></i>
          {{ isSubmitting ? 'Processing...' : 'Place Order' }}
        </button>
      </div>
    </form>
  </div>
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
      payment: "card",
      nameError: "",
      phoneError: "",
      isSubmitting: false
    };
  },
  computed: {
    isFormValid() {
      return this.name && this.phone && !this.nameError && !this.phoneError;
    }
  },
  methods: {
    validateName() {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!this.name) {
        this.nameError = "";
      } else if (!nameRegex.test(this.name)) {
        this.nameError = "Name must contain only letters";
      } else {
        this.nameError = "";
      }
    },
    validatePhone() {
      const phoneRegex = /^[0-9]+$/;
      if (!this.phone) {
        this.phoneError = "";
      } else if (!phoneRegex.test(this.phone)) {
        this.phoneError = "Phone must contain only numbers";
      } else {
        this.phoneError = "";
      }
    },
    async submit() {
      if (!this.isFormValid) return;
      
      this.isSubmitting = true;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      this.nameError = "";
      this.phoneError = "";
      this.isSubmitting = false;
    }
  }
};
</script>

<style scoped>
.checkout-form {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.form-header h4 {
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.form-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.checkout-form-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: var(--light-bg);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.section-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.9rem;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--card-bg);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input::placeholder {
  color: var(--text-secondary);
}

/* Error states */
.form-input.shake {
  border-color: var(--danger-color);
  animation: shake 0.5s ease-in-out;
}

.input-icon.pulse {
  color: var(--danger-color);
  animation: pulse 1s ease-in-out infinite;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Payment Options */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--card-bg);
  position: relative;
}

.payment-option:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.payment-option.active {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.payment-radio {
  margin-right: 1rem;
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
}

.payment-content i {
  font-size: 1.1rem;
  color: var(--primary-color);
}

/* Form Actions */
.form-actions {
  margin-top: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .checkout-form {
    padding: 1.25rem;
  }
  
  .form-section {
    padding: 1.25rem;
  }
  
  .payment-option {
    padding: 0.875rem;
  }
  
  .payment-content {
    font-size: 0.9rem;
  }
  
  .submit-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .checkout-form {
    padding: 1rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .form-input {
    padding: 0.75rem 0.75rem 0.75rem 2.25rem;
  }
  
  .input-icon {
    left: 0.75rem;
    font-size: 0.8rem;
  }
  
  .payment-option {
    padding: 0.75rem;
  }
  
  .payment-content {
    font-size: 0.85rem;
  }
}
</style>
