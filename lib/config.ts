
// API Configuration
// Use localhost for development, production URL for deployment
const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
export const API_CONFIG = {
  baseURL:  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'),
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const API_ENDPOINTS = {
  // Auth
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    logoutAll: '/auth/logout-all',
    refresh: '/auth/refresh',
    google: '/auth/google',
    resetPasswordRequest: '/auth/reset-password/request',
    resetPasswordConfirm: '/auth/reset-password/confirm',
    me: '/auth/me',
  },

  // Users
  users: {
    getProfile: '/users/me',
    updateProfile: '/users/me',
    deleteAccount: '/users/me',
  },

  // Plans
  plans: {
    getAll: '/plans',
    getOne: (id: string) => `/plans/${id}`,
  },

  // Subscriptions
  subscriptions: {
    subscribe: '/subscriptions/subscribe',
    current: '/subscriptions/current',
    changePlan: '/subscriptions/change-plan',
  },

  // Bundles
  bundles: {
    getAll: '/bundles',
    purchase: '/bundles/purchase',
  },

  // Chat
  chat: {
    getModels: '/chat/models',
    createSession: '/chat/sessions',
    getSessions: '/chat/sessions',
    deleteSession: (sessionId: string) => `/chat/sessions/${sessionId}`,
    sendMessage: (sessionId: string) => `/chat/${sessionId}/messages`,
    getHistory: (sessionId: string) => `/chat/${sessionId}/messages`,
  },

  // Image Generation
  image: {
    getModels: '/ai/models?category=image',
    generate: '/image-generation',
    improvePrompt: '/image-generation/improve-prompt',
    getHistory: '/image-generation',
    save: (generationId: string) => `/image-generation/${generationId}/save`,
    delete: (generationId: string) => `/image-generation/${generationId}`,
  },

  // Video Generation
  video: {
    getModels: '/video/models',
    improvePrompt: '/video/improve-prompt',
    textToVideo: '/video/text-to-video',
    imageToVideo: '/video/image-to-video',
    surpriseMe: '/video/surprise-me',
    getHistory: '/video/history',
    save: (generationId: string) => `/video/${generationId}/save`,
  },

  // Video Effects
  videoEffects: {
    getModels: '/video-effects/available-models',
    categories: '/video-effects/categories',
    generate: '/video-effects/generate',
    getHistory: '/video-effects/history',
    save: (effectId: string) => `/video-effects/${effectId}/save`,
  },

  // Media
  media: {
    delete: (mediaId: string) => `/media/${mediaId}`,
  },

  // Offers
  offers: {
    getAll: '/offers',
    getLatest: '/offers/latest',
    validate: '/offers/validate',
  },
}