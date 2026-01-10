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
  //-----------------------------------------------------------
  const [productData, setProductData] = useState({
    id:0,
    title: "",
    origin_price: "",
    price: "",
    unit: "",
    category: ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "origin_price" ? Number(value) : value
    }))


  }
  const handleAddData = () => {

    const data = {
      data: productData
    }
    axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, data)
      .then((res) => { getProduct() }).catch((err) => { console.log(err) })

  }

  const handleEditData = (item) => {
    setProductData(item)
  }
  const goEdit = () => {
    
    const data = {
      data: productData
    }
    axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${productData.id}`, data).then((res) => { getProduct() }).catch((err) => {
      console.log(err)
    })
  }

  const goDelete = (id)=>{
    axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${productData.id}`).then((res) => { getProduct() }).catch((err) => {
      console.log(err)})
  }


  return (
    isAuth ? <>

      <div className="flex justify-between">
        <div >
          <label htmlFor="title">名稱</label>
          <input type="text" id="title" name="title" value={productData.title} onChange={(e) => { handleInputChange(e) }} />
          <label htmlFor="origin_price">原價</label>
          <input id="origin_price" name="origin_price" type="number" value={productData.origin_price} onChange={(e) => { handleInputChange(e) }} />
          <label htmlFor="price">售價</label>
          <input type="number" name="price" id="price" value={productData.price} onChange={(e) => { handleInputChange(e) }} />
          <label htmlFor="unit">單位</label>
          <input type="text" name="unit" id="unit" value={productData.unit} onChange={(e) => { handleInputChange(e) }} />
          <label htmlFor="category">種類</label>
          <input type="text" name="category" id="category" value={productData.category} onChange={(e) => { handleInputChange(e) }} />
          <button onClick={() => {
            handleAddData()
          }}>新增商品</button>
          <button onClick={()=>{goEdit()}}>
            編輯商品
          </button>
        </div>

        <h2>產品列表</h2>
        <table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>原價</th>
              <th>售價</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.origin_price}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>{item.unit}</td>
                <td>
                  <button onClick={() => { handleEditData(item) }}>Edit</button>
                  <button onClick={()=>{
                    goDelete(item.id)
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
      :
      <>
        <label htmlFor="username"  >Account:</label>
        <input type="email" name="username" onChange={(e) => { handleForm(e.target) }} />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" onChange={(e) => { handleForm(e.target) }} />
        <button type="button" onClick={(e) => { handleSubmit(e) }}>Submit</button>
      </>
  );
}

export default App;