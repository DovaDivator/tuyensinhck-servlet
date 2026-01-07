/**
 * Mã hóa mật khẩu bằng thuật toán SHA-256.
 *
 * Hàm này sử dụng Web Crypto API để băm (hash) mật khẩu đầu vào thành một chuỗi hex.
 * Đây là phương pháp bảo mật một chiều, không thể giải ngược lại mật khẩu gốc.
 * @param {string} password - Chuỗi mật khẩu cần mã hóa.
 * @returns {Promise<string>} - Một Promise trả về chuỗi băm dạng hexadecimal (mã hex).
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashedPassword;
}