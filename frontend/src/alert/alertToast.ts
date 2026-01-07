import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  background: "#fff",
  color: "#000",
  showClass: {
    popup: "toast_show",
  },
  hideClass: {
    popup: "toast_hide",
  },
});

export const showToast = (
  icon: SweetAlertIcon = "error",
  title: string = "Thông báo",
  message: string
): Promise<SweetAlertResult<any>> => {
  return Toast.fire({
    icon,
    title,
    text: message,
  });
};
