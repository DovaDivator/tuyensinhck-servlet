import Swal from 'sweetalert2';
import type { SweetAlertResult } from 'sweetalert2';

const validIcons = ['success', 'error', 'warning', 'info', 'question'];
const defaultTitle = 'Thông báo';

// Định nghĩa kiểu cho tham số của hàm
interface AlertOptions {
  icon?: string;
  title?: string;
  message: string;
  footer?: string;
  timer?: number;
  callback?: () => void;
}

/**
 * Hiển thị một hộp thoại thông báo đơn giản sử dụng SweetAlert2.
 *
 * @param {Object} options - Các tuỳ chọn để cấu hình hộp thoại thông báo.
 * @param {string} [options.icon='error'] - Biểu tượng hiển thị trong thông báo. Chỉ chấp nhận ['success', 'error', 'warning', 'info', 'question']. Mặc định và các TH sai chuyển hết về 'error'
 * @param {string} [options.title=defaultTitle] - Tiêu đề của thông báo.
 * @param {string} options.message - Nội dung chính của thông báo.
 * @param {string} [options.footer=''] - Phần nội dung hiển thị ở chân thông báo (footer).
 * @param {number} [options.timer=0] - Thời gian tự động đóng thông báo (tính bằng milliseconds). Nếu là 0 thì không tự đóng.
 * @returns {void}
 *
 * @example
 * showBasicAlert({
 *   icon: 'success',
 *   title: 'Thành công',
 *   message: 'Dữ liệu đã được lưu thành công!',
 *   footer: 'Vui lòng kiểm tra lại sau.',
 *   timer: 3000,
 * }).then((result) => {Chạy hàm xử lý kết quả});
 */
export const alertBasic = ({
  icon = 'error',
  title = defaultTitle,
  message = '',
  footer = '',
  timer = 0,
  callback = () => {}
}: AlertOptions): Promise<SweetAlertResult> => {
  const normalizedIcon = icon.toLowerCase();
  const finalIcon = validIcons.includes(normalizedIcon) ? normalizedIcon : 'error';

  return Swal.fire({
    icon: finalIcon as any,
    title,
    text: message,
    footer,
    timer,
    customClass: {
      confirmButton: 'btn-confirm'
    },
  }).then((result) => {
    callback();
    return result;
  });
};