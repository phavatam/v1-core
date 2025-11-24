// get cookie name
export const getCookie = (name: string) => {
  let cookieValue = "";
  if (document.cookie) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
//add a cookie
// export const setCookie = (name: string, value: string, days = Date.now()) => {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// };
export const setCookie = (name: string, value: string, days: number = 1) => {
  let expires = "";

  // 1. Tính toán ngày hết hạn
  if (days) {
    const date = new Date();
    // date.setHours(date.getHours() + (days * 24)); // Có thể dùng setHours cho đơn giản
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  // 2. Định nghĩa thuộc tính bảo mật
  // - path=/: Cho phép truy cập cookie trên toàn bộ trang web.
  // - Secure: BẮT BUỘC nếu bạn dùng HTTPS.
  // - SameSite=Lax: Ngăn chặn gửi cookie trong các yêu cầu chéo trang (CSRF), là tiêu chuẩn mới.
  const secureAttributes = "; path=/; SameSite=Lax";

  // Kiểm tra xem trang web có đang dùng HTTPS không (thường là môi trường production/staging)
  const isSecure = window.location.protocol === "https:" ? "; Secure" : "";

  // 3. Set Cookie: Bắt buộc mã hóa giá trị (value)
  document.cookie = name + "=" + (value ? encodeURIComponent(value) : "") + expires + isSecure + secureAttributes;
};
//delete a cookie
export const deleteCookie = (name: string) => {
  setCookie(name, "", -1);
};
//delete a cookie
export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    setCookie(cookie.split("=")[0], "", -1);
  }
};
