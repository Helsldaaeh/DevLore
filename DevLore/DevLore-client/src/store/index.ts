import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        
    },
    //Временное решение, нужно что бы не жаловалось что hubConnection не сериализуем.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch