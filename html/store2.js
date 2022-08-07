// import { createSlice } from '@reduxjs/toolkit'
const {
  getDefaultMiddleware,
	createSlice,
	createStore,
	configureStore
} = window.RTK;

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
      console.log(')))))))))))))))))))))))))',state.value)
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

const { 
    increment, 
    decrement, 
    incrementByAmount 
} = counterSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
const selectCount = (state) => state.counter.value

// export default counterSlice.reducer

const streamsSlice = createSlice({
  name: 'streams',
  initialState: {
    localStream: undefined,
    remoteStream:undefined,
    // remoteStreams:[],
  },
  reducers: {
    setLocalStream:(state,action)=>{
      state.localStream=action.payload
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@',state.localStream)
    },
    removeLocalStream:(state)=>{
      state.localStream=null
    },
    setRemoteStream:(state,action)=>{
      state.remoteStream = action.payload
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',state.remoteStream)
    },
    removeRemoteStream:(state)=>{
      state.remoteStream=null
      // const stream = action.payload
      // state.remoteStreams=Arrays.from(state.remoteStreams.filter((element)=>element.id !=stream.id))
    },



  },

})

const { 
  setLocalStream,
  removeLocalStream,

  setRemoteStream,
  removeRemoteStream

} = streamsSlice.actions





const store2 =  configureStore({
    reducer: {
      counter: counterSlice.reducer,
      streams:streamsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
  })

  // exports.store2=store2

// const store2 = createS

  