export const validateTypeText: {
  [key: string]: (value: string) => boolean;
} = {
  email: (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  },
  phone: (value: string): boolean => {
    const regex = /^0[0-9]{9}$/;
    return regex.test(value);
  },
  password: (value: string): boolean => {
    const regex = /^[\x20-\x7E]+$/;
    return regex.test(value);
  },
  cccd: (value: string): boolean => {
    const regex = /^\d{12}$/; // đúng 12 chữ số
    return regex.test(value);
  }
};
