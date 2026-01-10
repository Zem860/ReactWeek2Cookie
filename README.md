🔐 React Login：Token 寫入 Cookie

本文件說明 React 前端在登入成功後，如何將後端回傳的 token 寫入 Cookie，並在後續 API 請求中使用。

📦 使用技術

React

Axios

Cookie（前端寫入）

🧭 流程說明

使用者送出帳密

後端回傳 token 與 expired

前端將 token 寫入 Cookie

API 請求自動帶入 Authorization
