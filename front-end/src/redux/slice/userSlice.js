import { createSlice } from "@reduxjs/toolkit";
import {toast} from 'react-hot-toast';
async function signOutHandler()
{
    try{
        await fetch(`${process.env.REACT_APP_BASE_URL}/signOut`,{
          method:'POST'
        });
      }catch(err)
      {
        toast.error("Cookie not cleared")
        console.log(err);
      }
}
const initialState={
    currentUser: null,
    error: null,
    loading:false
}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInstart:(state)=>{
            state.loading=true,
            state.error=null;
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false,
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload;
        },
        signOut:(state)=>{
            state.currentUser=null;
            signOutHandler();
        },
        updateStart:(state)=>{
            state.loading=true,
            state.error=null;
        },
        updateSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false,
            state.error=null;
        },

        updateFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload;
        },
        deleteSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false,
            state.error=null;
        },
    }
})
export const {signInstart,signInSuccess,signInFailure,signOut,updateSuccess,updateStart,updateFailure,deleteSuccess} =userSlice.actions;
export default userSlice.reducer;