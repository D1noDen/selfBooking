import { create } from "zustand";



const useAuth = create((set) => ({
    auth : null,
    setAuth : (data) => set ( { auth : data } ) ,
}));


export default useAuth;