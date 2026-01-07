import React, {JSX} from 'react';

/**
 * Định nghĩa một lựa chọn.
 */
export interface ChoiceOption {
  value: string;
  label: string | JSX.Element;
}

/**
 * Lớp quản lý các lựa chọn checkbox đảm bảo value không trùng lặp.
 * 
 * @param options Mảng các lựa chọn gồm `value` và `label`.
 * @param value: Tên giá trị, chỉ chứa a-z, A-Z, 0-9, `_`, `-`
 * @param label: Tên hiển thị của giá trị. Có thể ở dạng string hoặc JSX
 */
export class ChoiceGroup {
  private choices: ChoiceOption[];
  private valuesSet: Set<string>;


  constructor(options: ChoiceOption[] = []) {
    this.choices = [];
    this.valuesSet = new Set();

    options.forEach(({ value, label }) => {
      const sanitizedValue = /^[a-zA-Z0-9_-]+$/.test(value) ? value : '';

      if (sanitizedValue === '' || this.valuesSet.has(sanitizedValue)) {
        console.warn(`Duplicate or invalid value skipped: ${value}`);
        return;
      }

      this.valuesSet.add(sanitizedValue);
      this.choices.push({ value: sanitizedValue, label });
    });
  }

  /**
   * Lấy danh sách các lựa chọn hợp lệ.
   * @returns Mảng các lựa chọn.
   */
  getOptions(): ChoiceOption[] {
    return this.choices;
  }

  /**
   * Kiểm tra xem giá trị `val` có tồn tại trong nhóm hay không.
   * @param val Giá trị cần kiểm tra
   * @returns true nếu tồn tại, false nếu không
   */
  hasValue(val: string): boolean {
    return this.valuesSet.has(val);
  }
}
