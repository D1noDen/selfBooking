import { useState } from 'react'
import BookingLayout from './pages/BookingLayout'
import './App.css'
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from "@tanstack/react-query";
function App() {
  const [count, setCount] = useState(0)
const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry:0,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if( error?.response?.data?.DisplayMessage === 'Shift Not Found') {
          GlobalToast(
            error?.response?.data?.DisplayMessage || "Something went wrong",
            "warning"
          );
        }else {
        GlobalToast(
          error?.response?.data?.DisplayMessage || "Something went wrong",
          "error"
        );
        }
      },
    }),
  });
  return (
    <>
    <QueryClientProvider client={client}>
     <BookingLayout/>
     </QueryClientProvider>
    </>
  )
}

export default App
