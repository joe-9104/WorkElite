import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [token,setToken]=useState("");

  useEffect(() => {
    const abortCont = new AbortController();
    setToken(Cookies.get("token"))
    if(!token){
      return
    }
    setTimeout(() => {
      fetch(url, { signal: abortCont.signal, headers:  {Authorization: `Bearer ${token}`} })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        } 
        return res.json();
      })
      .then(data => {
        setIsPending(false);
        setData(data);
        setError(null);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        } else {
          // auto catches network / connection error
          setIsPending(false);
          setError(err.message);
        }
      })
    }, 1000);

    // abort the fetch
    return () => abortCont.abort();
  }, [url, token])

  return { data, isPending, error };
}
 
export default useFetch;