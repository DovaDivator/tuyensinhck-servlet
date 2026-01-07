interface InputOptionsParams {
  stringCase?: string;
  restrict?: boolean;
}

/**
   * Tạo một thể hiện của InputOptions.
   * 
   * @param {InputOptionsParams} [param0] - Đối tượng tùy chọn để khởi tạo giá trị.
   * @param {string} [param0.stringCase=''] - Định dạng chữ cái ('upper', 'lower', ...). Mặc định là ''.
   * @param {boolean} [param0.restrict=false] - Có hạn chế đầu vào cho Unicode hay không. mặc định false
   */
export class InputOptions {
  stringCase: string;
  restrict: boolean;

  constructor({ stringCase = '', restrict = false }: InputOptionsParams = {}) {
    this.stringCase = stringCase;
    this.restrict = restrict;
  }
}