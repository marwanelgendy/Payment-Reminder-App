import { useMutation } from "react-query"
import axios from "axios"



export const useAddUser = () => {

    const  addUser =  (user) => {
        return axios.post('http://localhost:5000/userRegisteration/signup' , user)
    }

    return useMutation('signup',addUser)
    
}