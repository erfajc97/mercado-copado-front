export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  RENEW_TOKEN: '/auth/refresh-token',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  GOOGLE_AUTH: '/auth/google',
  GOOGLE_CALLBACK: '/auth/google/callback',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password/',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION_EMAIL: '/auth/resend-verification-email',
  VERIFY_RESET_PASSWORD_TOKEN: '/auth/verify-reset-password-token',

  // Users
  USER_INFO: '/users/me',
  USERS: '/users',
  UPDATE_USER: '/users',
  ADMIN_USERS: '/users/admin',

  // Categories
  CATEGORIES: '/categories',
  CATEGORY: '/categories',

  // Subcategories
  SUBCATEGORIES: '/subcategories',
  SUBCATEGORY: '/subcategories',

  // Products
  PRODUCTS: '/products',
  PRODUCT: '/products',

  // Cart
  CART: '/cart',
  CART_ITEM: '/cart',

  // Addresses
  ADDRESSES: '/addresses',
  ADDRESS: '/addresses',
  SET_DEFAULT_ADDRESS: '/addresses/set-default',

  // Orders
  ORDERS: '/orders',
  ORDER: '/orders',
  MY_ORDERS: '/orders/my-orders',

  // Payments
  PAYMENTS: '/payments',
  CREATE_TRANSACTION: '/payments/create-transaction',
  CREATE_TRANSACTION_WITHOUT_ORDER:
    '/payments/create-transaction-without-order',
  PENDING_TRANSACTIONS: '/payments/my-pending-payments',
  UPDATE_TRANSACTION_STATUS: '/payments/update-status',
  DELETE_PENDING_PAYMENT: '/payments/my-pending-payments',
  PHONE_PAYMENT: '/payments/phone-payment',
  CREATE_ORDER_FROM_TRANSACTION: '/payments/create-order-from-transaction',
  CASH_DEPOSIT: '/payments/cash-deposit',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',

  // Profile
  PROFILE: '/profile',

  // Payment Methods (tarjetas guardadas del usuario)
  PAYMENT_METHODS: '/payment-methods', // GET (listar) y POST (crear)
  PAYMENT_METHOD_BY_ID: '/payment-methods', // Base para operaciones con ID (DELETE, PATCH)
}
