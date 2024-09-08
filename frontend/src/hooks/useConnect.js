//imports
import { useState,useEffect } from "react"
import Cookies from "js-cookie"


const useConnect = () => {
    const [user, setUser] = useState("")
    const [error,setError] = useState(null)//used to set the error text on the page
    const [isPending,setIsPending] = useState(true)//used to set the loading animation

   //a function to fetch the user from the db using an id and a token 
   const getUser = async (id,token) => {
     try {
        const response = await fetch(
          "http://localhost:4000/api/auth/users/"+id,
          {
            method : 'GET',
            headers : {
              Authorization: `Bearer ${token}`,
            }
          }
          )
        const json = await response.json();
        if(!response.ok){
            console.log(json.message)
        }
        if(response.ok){
            console.log("user fetched" , json)
            sessionStorage.setItem("user",JSON.stringify(json.user))
            setError(null)
            setIsPending(false)
            setUser(json.user)
        }
     } catch (error) {
      setIsPending(false)
      setError(error.message)
     }
   } 

  /*useEffect(() => {
    try {
      //check if we got a user object from an other route buy using navigate
      const user_data = state.user
      if(user_data){
        setIsPending(false)
        setUser(user_data)
        console.log(user_data)
      }
    } catch (error) {
      //if there is no user recieved in this route we fetch the user from the db using the cookie and the stored id
      const token = Cookies.get("token")
      const id = localStorage.getItem("user_id")
      if (token && id){
        getUser(id,token)
      }
      if (!token || !id){
        //if the cookie expired or the id is unavailable we quit the route to the login 
        setIsPending(false)
        setError("session expired")
        Cookies.remove(token)
        localStorage.removeItem("user_id")
        
      }
    }
  }, []);
  return [user, isPending,error]
}*/

useEffect(() => {

    //check if we got a user storerd in session storage 
    const userData =JSON.parse(sessionStorage.getItem("user")) 
    if(userData){
      setUser(userData)
      setIsPending(false)
    }
    if(!userData){
        //get the token 
        const token = Cookies.get("token")
        //get the user id from local storage
        const id = localStorage.getItem("user_id")
        if (token && id){
          getUser(id,token)
        }
        if (!token || !id){
          //if the cookie expired or the id is unavailable we quit the route to the login 
          setIsPending(false)
          setError("session expired")
          Cookies.remove(token)
          localStorage.removeItem("user_id")
            
        }
    }
},[])
return  [user, isPending,error]
}

export default useConnect;