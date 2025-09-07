import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  enrolledCourses: [],
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
    },
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setCourses,
  setCurrentCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  setEnrolledCourses,
  setError,
} = courseSlice.actions;

export default courseSlice.reducer;