import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
function App() {
  const loginFormData = { username: "", password: "" }
  const [formData, setFormData] = useState(loginFormData)
  const [isAuth, setIsAuth] = useState(false)
  const [products, setProducts] = useState([])

  const handleForm = (target) => {
    const { name, value } = target
    setFormData((prev) => (
      {
        ...prev,
        [name]: value.trim()
      }
    ))
  }
  const getProduct = () => {
    axios.get(`${API_BASE}/api/${API_PATH}/admin/products/all`)
      .then((res) => { setProducts(Object.values(res.data.products)) })
      .catch((err) => { console.log(err) })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`${API_BASE}/admin/signin`, formData).then((res) => {
      const { token, expired } = res.data
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
      if (token) {
        axios.defaults.headers.common.Authorization = token
        setIsAuth(true)
      }
      getProduct();
    }
    ).catch(err => {
      console.log(err)
    })
  }
  async function checkLogin() {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )      //將cookie字串取出

      //打post之前在axios的headers加入token
      axios.defaults.headers.common.Authorization = token;
      const res = await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(res)
      getProduct();
    } catch (error) {
      console.error(error);
      setIsAuth(false)

    }
  }
  useEffect(() => {
    checkLogin();
  }, [])

  return (
    isAuth ? <>
      <h2>產品列表</h2>
      <table>
        <thead>
          <tr>
            <th>名稱</th>
            <th>原價</th>
            <th>售價</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.origin_price}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
      :
      <>
        <label htmlFor="username"  >Account:</label>
        <input type="text" name="username" onChange={(e) => { handleForm(e.target) }} />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" onChange={(e) => { handleForm(e.target) }} />
        <button type="button" onClick={(e) => { handleSubmit(e) }}>Submit</button>
      </>
  );
}

export default App;