import { useState, useCallback, useEffect } from 'react';
/*--------------------------------------------------------------------------*/

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [username, setUsername] = useState(false);
  const [role, setRole] = useState()
  const [image, setImage] = useState()

  // Set user token when logging in
  const login = useCallback((uid, token, firstname, role, image, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setUsername(firstname);
    setRole(role)
    setImage(image)

    // Setting an expire time for json web token for 1 hour
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);

    // Setting user information after logging in
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        username: firstname,
        role: role,
        image: image,
        expiration: tokenExpirationDate.toISOString()
      })
    );
    //console.log(localStorage.userData)
  }, []);
  

  // Remove token and other user data from local storage when user is logging out
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUsername(null);
    setRole(null)
    setImage(null)
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, storedData.username, storedData.role, storedData.image, new Date(storedData.expiration));
    } 
  }, [login]);

  return { token, login, logout, userId, username, role, image };
};
/*--------------------------------------------------------------------------*/
export default useAuth