import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getters } from '../../src/index';

// =============================================================================
// BASIC EXAMPLES - Simple getters without immer
// =============================================================================

// 1. Basic Counter - Simple computed values
interface BasicCounterState {
  count: number;
  double: number;
  triple: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useBasicCounterStore = create<BasicCounterState>()(
  getters((set) => ({
    count: 0,
    // Basic reactive getters
    get double() {
      return this.count * 2;
    },
    get triple() {
      return this.count * 3;
    },
    increment: () =>
      set((state) => ({
        ...state,
        count: state.count + 1,
      })),
    decrement: () =>
      set((state) => ({
        ...state,
        count: state.count - 1,
      })),
    reset: () =>
      set((state) => ({
        ...state,
        count: 0,
      })),
  })),
);

// 2. Basic User - String manipulation
interface BasicUserState {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  updateFirstName: (name: string) => void;
  updateLastName: (name: string) => void;
}

export const useBasicUserStore = create<BasicUserState>()(
  getters((set) => ({
    firstName: 'John',
    lastName: 'Doe',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    get initials() {
      return `${this.firstName[0]}${this.lastName[0]}`;
    },
    updateFirstName: (name: string) =>
      set((state) => ({
        ...state,
        firstName: name,
      })),
    updateLastName: (name: string) =>
      set((state) => ({
        ...state,
        lastName: name,
      })),
  })),
);

// =============================================================================
// INTERMEDIATE EXAMPLES - More complex logic
// =============================================================================

// 3. Shopping Cart (without immer) - Chained getters
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface IntermediateCartState {
  items: CartItem[];
  taxRate: number;
  discountPercent: number;
  // Computed values
  subtotal: number;
  discount: number;
  subtotalAfterDiscount: number;
  tax: number;
  total: number;
  itemCount: number;
  isEmpty: boolean;
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  setTaxRate: (rate: number) => void;
  setDiscount: (percent: number) => void;
  clearCart: () => void;
}

export const useIntermediateCartStore = create<IntermediateCartState>()(
  getters((set) => ({
    items: [] as CartItem[],
    taxRate: 0.08,
    discountPercent: 0,
    // Chained getters - each depends on previous ones
    get subtotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    get discount() {
      return this.subtotal * (this.discountPercent / 100);
    },
    get subtotalAfterDiscount() {
      return this.subtotal - this.discount;
    },
    get tax() {
      return this.subtotalAfterDiscount * this.taxRate;
    },
    get total() {
      return this.subtotalAfterDiscount + this.tax;
    },
    get itemCount() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    get isEmpty() {
      return this.items.length === 0;
    },
    addItem: (item) =>
      set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            ...state,
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          };
        }
        return {
          ...state,
          items: [...state.items, { ...item, quantity: 1 }],
        };
      }),
    updateQuantity: (id, quantity) =>
      set((state) => ({
        ...state,
        items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      })),
    removeItem: (id) =>
      set((state) => ({
        ...state,
        items: state.items.filter((item) => item.id !== id),
      })),
    setTaxRate: (rate) =>
      set((state) => ({
        ...state,
        taxRate: rate,
      })),
    setDiscount: (percent) =>
      set((state) => ({
        ...state,
        discountPercent: percent,
      })),
    clearCart: () =>
      set((state) => ({
        ...state,
        items: [],
      })),
  })),
);

// 4. Todo List (with immer) - Array operations
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  // Computed values
  filteredTodos: Todo[];
  totalCount: number;
  activeCount: number;
  completedCount: number;
  allCompleted: boolean;
  // Actions
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  clearCompleted: () => void;
  toggleAll: () => void;
}

// Note: For proper type inference with immer, place getters OUTSIDE immer
// This allows immer to directly provide its void-accepting set to the stateCreator
export const useTodoStore = create<TodoState>()(
  getters(
    immer<TodoState>((set) => ({
      todos: [] as Todo[],
      filter: 'all' as 'all' | 'active' | 'completed',
      get filteredTodos() {
        if (this.filter === 'active') return this.todos.filter((t) => !t.completed);
        if (this.filter === 'completed') return this.todos.filter((t) => t.completed);
        return this.todos;
      },
      get totalCount() {
        return this.todos.length;
      },
      get activeCount() {
        return this.todos.filter((t) => !t.completed).length;
      },
      get completedCount() {
        return this.todos.filter((t) => t.completed).length;
      },
      get allCompleted() {
        return this.todos.length > 0 && this.todos.every((t) => t.completed);
      },
      addTodo: (text) =>
        set((state) => {
          state.todos.push({
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: Date.now(),
          });
        }),
      toggleTodo: (id) =>
        set((state) => {
          const todo = state.todos.find((t: Todo) => t.id === id);
          if (todo) {
            todo.completed = !todo.completed;
          }
        }),
      deleteTodo: (id) =>
        set((state) => {
          state.todos = state.todos.filter((t: Todo) => t.id !== id);
        }),
      setFilter: (filter) =>
        set((state) => {
          state.filter = filter;
        }),
      clearCompleted: () =>
        set((state) => {
          state.todos = state.todos.filter((t: Todo) => !t.completed);
        }),
      toggleAll: () =>
        set((state) => {
          const shouldComplete = !state.todos.every((t: Todo) => t.completed);
          state.todos.forEach((t: Todo) => {
            t.completed = shouldComplete;
          });
        }),
    })),
  ),
);

// =============================================================================
// ADVANCED EXAMPLES - Complex nested state and multiple computed chains
// =============================================================================

// 5. Analytics Dashboard (without immer) - Complex nested getters
interface DataPoint {
  timestamp: number;
  value: number;
}

interface AdvancedAnalyticsState {
  dataPoints: DataPoint[];
  timeRange: number; // in milliseconds
  threshold: number;
  // Computed values - nested computation chain
  filteredData: DataPoint[];
  average: number;
  minimum: number;
  maximum: number;
  aboveThreshold: number;
  belowThreshold: number;
  variance: number;
  standardDeviation: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  // Actions
  addDataPoint: (value: number) => void;
  setTimeRange: (range: number) => void;
  setThreshold: (threshold: number) => void;
  clearData: () => void;
}

export const useAdvancedAnalyticsStore = create<AdvancedAnalyticsState>()(
  getters((set) => ({
    dataPoints: [] as DataPoint[],
    timeRange: 60000, // 1 minute
    threshold: 50,
    get filteredData() {
      const cutoff = Date.now() - this.timeRange;
      return this.dataPoints.filter((dp) => dp.timestamp >= cutoff);
    },
    get average() {
      if (this.filteredData.length === 0) return 0;
      return this.filteredData.reduce((sum, dp) => sum + dp.value, 0) / this.filteredData.length;
    },
    get minimum() {
      if (this.filteredData.length === 0) return 0;
      return Math.min(...this.filteredData.map((dp) => dp.value));
    },
    get maximum() {
      if (this.filteredData.length === 0) return 0;
      return Math.max(...this.filteredData.map((dp) => dp.value));
    },
    get aboveThreshold() {
      return this.filteredData.filter((dp) => dp.value > this.threshold).length;
    },
    get belowThreshold() {
      return this.filteredData.filter((dp) => dp.value <= this.threshold).length;
    },
    get variance() {
      if (this.filteredData.length === 0) return 0;
      const avg = this.average;
      return (
        this.filteredData.reduce((sum, dp) => sum + Math.pow(dp.value - avg, 2), 0) /
        this.filteredData.length
      );
    },
    get standardDeviation() {
      return Math.sqrt(this.variance);
    },
    get trend() {
      if (this.filteredData.length < 2) return 'stable';
      const first = this.filteredData[0].value;
      const last = this.filteredData[this.filteredData.length - 1].value;
      const diff = last - first;
      if (Math.abs(diff) < 5) return 'stable';
      return diff > 0 ? 'increasing' : 'decreasing';
    },
    addDataPoint: (value) =>
      set((state) => ({
        ...state,
        dataPoints: [
          ...state.dataPoints,
          {
            timestamp: Date.now(),
            value,
          },
        ],
      })),
    setTimeRange: (range) =>
      set((state) => ({
        ...state,
        timeRange: range,
      })),
    setThreshold: (threshold) =>
      set((state) => ({
        ...state,
        threshold,
      })),
    clearData: () =>
      set((state) => ({
        ...state,
        dataPoints: [],
      })),
  })),
);

// 6. Form with Validation (with immer) - Conditional getters
interface FormField {
  value: string;
  touched: boolean;
  error?: string;
}

interface AdvancedFormState {
  fields: {
    email: FormField;
    password: FormField;
    confirmPassword: FormField;
    username: FormField;
  };
  // Computed validation states
  isEmailValid: boolean;
  isPasswordValid: boolean;
  doPasswordsMatch: boolean;
  isUsernameValid: boolean;
  isFormValid: boolean;
  touchedFields: number;
  errorCount: number;
  fieldErrors: string[];
  canSubmit: boolean;
  // Actions
  setFieldValue: (field: keyof AdvancedFormState['fields'], value: string) => void;
  setFieldTouched: (field: keyof AdvancedFormState['fields']) => void;
  resetForm: () => void;
  submitForm: () => void;
}

// Note: For proper type inference with immer, place getters OUTSIDE immer
export const useAdvancedFormStore = create<AdvancedFormState>()(
  getters(
    immer((set) => ({
      fields: {
        email: { value: '', touched: false },
        password: { value: '', touched: false },
        confirmPassword: { value: '', touched: false },
        username: { value: '', touched: false },
      },
      get isEmailValid() {
        const email = this.fields.email.value;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      get isPasswordValid() {
        const password = this.fields.password.value;
        return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
      },
      get doPasswordsMatch() {
        return (
          this.fields.password.value === this.fields.confirmPassword.value &&
          this.fields.password.value.length > 0
        );
      },
      get isUsernameValid() {
        const username = this.fields.username.value;
        return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
      },
      get isFormValid() {
        return (
          this.isEmailValid && this.isPasswordValid && this.doPasswordsMatch && this.isUsernameValid
        );
      },
      get touchedFields() {
        return Object.values(this.fields).filter((f) => f.touched).length;
      },
      get errorCount() {
        return this.fieldErrors.length;
      },
      get fieldErrors() {
        const errors: string[] = [];
        if (this.fields.email.touched && !this.isEmailValid) {
          errors.push('Invalid email address');
        }
        if (this.fields.password.touched && !this.isPasswordValid) {
          errors.push('Password must be 8+ chars with letters and numbers');
        }
        if (this.fields.confirmPassword.touched && !this.doPasswordsMatch) {
          errors.push('Passwords do not match');
        }
        if (this.fields.username.touched && !this.isUsernameValid) {
          errors.push('Username must be 3+ alphanumeric characters');
        }
        return errors;
      },
      get canSubmit() {
        return this.isFormValid && this.touchedFields === 4;
      },
      setFieldValue: (field, value) =>
        set((state) => {
          state.fields[field].value = value;
        }),
      setFieldTouched: (field) =>
        set((state) => {
          state.fields[field].touched = true;
        }),
      resetForm: () =>
        set((state) => {
          state.fields.email = { value: '', touched: false };
          state.fields.password = { value: '', touched: false };
          state.fields.confirmPassword = { value: '', touched: false };
          state.fields.username = { value: '', touched: false };
        }),
      submitForm: () =>
        set((state) => {
          console.log('Form submitted with values:', {
            email: state.fields.email.value,
            username: state.fields.username.value,
          });
        }),
    })),
  ),
);

// =============================================================================
// DEMONSTRATION STORE - Shows that getters cannot be set
// =============================================================================

interface ReadonlyDemoState {
  value: number;
  computedValue: number;
  setValue: (n: number) => void;
  attemptToSetGetter: (n: number) => void;
  lastError: string | null;
}

export const useReadonlyDemoStore = create<ReadonlyDemoState>()(
  getters((set) => ({
    value: 10,
    get computedValue() {
      return this.value * 2;
    },
    lastError: null,
    setValue: (n) =>
      set((state) => ({
        ...state,
        value: n,
        lastError: null,
      })),
    attemptToSetGetter: (n) =>
      set((state) => {
        try {
          // This will not actually change the getter's computed value
          // The getter is defined by its function, not by assignment
          state.computedValue = n;
          return {
            ...state,
            lastError: 'Surprisingly, no error was thrown, but the getter was not changed!',
          };
        } catch (error) {
          return {
            ...state,
            lastError: `Error: ${error}`,
          };
        }
      }),
  })),
);
