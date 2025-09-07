// Event bus for real-time updates across components
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();

// Event types
export const EVENTS = {
  COURSE_CREATED: 'course_created',
  COURSE_UPDATED: 'course_updated',
  COURSE_DELETED: 'course_deleted',
  COURSE_APPROVED: 'course_approved',
  QUIZ_CREATED: 'quiz_created',
  QUIZ_UPDATED: 'quiz_updated',
  QUIZ_DELETED: 'quiz_deleted',
  DISCUSSION_CREATED: 'discussion_created',
  DISCUSSION_UPDATED: 'discussion_updated',
  ENROLLMENT_REQUESTED: 'enrollment_requested',
  ENROLLMENT_APPROVED: 'enrollment_approved',
};
