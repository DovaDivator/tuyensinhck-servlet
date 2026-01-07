import React, { useMemo, JSX, MemoExoticComponent} from 'react';
import useScrollbar from '../../../function/triggers/useScrollbar';
import { HeaderProps, RowData} from '../../../types/listTable';
import './ListTable.scss';

// Hằng số cho các class cột
const COLUMN_CLASSES = ['th-center', 'th-num', 'th-short', 'th-text', 'th-long'];

interface ListTableProps {
  struct?: RowData[];
  headers?: HeaderProps;
  isNumbering?: boolean;
  isRanking?: boolean;
  className?: string;
  error?: string;
}

/**
 * Component hiển thị danh sách dạng với các cột tùy chỉnh hỗ trợ đánh số thứ tự. (Tham khảo ./src/types/listTable.ts)
 * @param {{ value: string, label: string | JSX.Element }[]} options 
 * @param {RowData[]} struct - Mảng dữ liệu, mỗi phần tử là một object (struct) đại diện cho một hàng. Chú ý thuộc tính link sẽ tạo liên kết mở tab mới khi ấn.
 * @param {HeaderProps} headers - Object chứa key và nhãn của các cột để ánh xạ khi đặt tên. Không có thì sẽ không có Header. Nếu có thì cần ghi chính xác key với 
 * @param {boolean} isNumbering - Hiển thị cột thứ tự (mặc định false)
 * @param {boolean} isRanking - Nổi bật thứ hạng trong STT, chỉ hoạt động khi có numbering (mặc định false)
 * @param {string} className - Class CSS tùy chỉnh cho bảng
 * @param {string} error - Thông báo lỗi lên bảng (mặc định là không có dữ liệu)
 * 
 * @example
 * ```jsx
 * const data = [
 *   { id: 1, name: "John", age: 30 },
 *   { id: 2, name: "Jane", age: 25, link: "google.com" }
 * ];
 * const headers = { name: "Tên", age: "Tuổi" };
 * <ListTable struct={data} headers={headers} isNumbering={true} className="my-table" error="Lỗi mất dữ liệu", links={links}/>
 * ```
 */
// const ListTable = React.memo(({ struct = [], headers = {}, isNumbering = false, className = "", error = "", links = [], isRanking = false}) => {
  const ListTable = ({
    struct = [],
    headers = {},
    isNumbering = false,
    className = "",
    error = "",
    isRanking = false
  }: ListTableProps): JSX.Element => {
  const [hasScrollbar, listRef] = useScrollbar();

  // Xác định keys của cột
  const keys = useMemo(
    (): string[] => (Object.keys(headers).length > 0 ? Object.keys(headers) : struct.length > 0 && struct[0] ? Object.keys(struct[0]) : []),
    [headers, struct]
  );

  // Hàm xác định chỉ số class cho cột dựa trên giá trị
  const getColumnClass = (value: any): number => {
    if (value === null || value === undefined) return 0; // th-center
    if (typeof value === 'boolean') return 0; // th-center
    if (typeof value === 'number') return value < Math.pow(10, 10) ? 1 : 2; // th-num hoặc th-center
    if (typeof value === 'string') {
      if (value.length < 20) return 2; // th-short
      if (value.length < 60) return 3; // th-text
      return 4; // th-long
    }
    return 0; // th-center
  };

  const getRankingClass = (rank: number): string => {
    if (!isNumbering || !isRanking) return COLUMN_CLASSES[0];
    if (rank < 6) return `${COLUMN_CLASSES[0]} rank-${rank}`;
    return COLUMN_CLASSES[0];
  };

  // Tính toán chỉ số class cho từng cột
  const columnClasses = useMemo((): number[] => {
    const updatedClasses = Array(keys.length).fill(0);
    if (isNumbering) {
      updatedClasses.unshift(0);
    }
    struct.forEach((item) => {
      keys.forEach((key, index) => {
        const newClass = getColumnClass(item[key] ?? null);
        updatedClasses[isNumbering ? index + 1 : index] = Math.max(updatedClasses[isNumbering ? index + 1 : index], newClass);
      });
    });
    return updatedClasses;
  }, [struct, keys, isNumbering]);

  const handleRowClick = (row: RowData): void => {
    if (row.link) {
      window.open(row.link, "_blank");
    }
  };

  return (
    <div ref={listRef} className={`list-table-container ${hasScrollbar}`}>
      <table className={`list-table ${className}`}>
        {Object.keys(headers).length > 0 && (
          <thead>
            <tr>
              {isNumbering && <th className={COLUMN_CLASSES[0]}>STT</th>}
              {Object.entries(headers).map(([key, label], index) => (
                <th key={key} className={COLUMN_CLASSES[columnClasses[isNumbering ? index + 1 : index]]}
                >{label}</th> 
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {struct.length > 0 ? (
            struct.map((item, rowIndex) => (
              <tr key={item.id || rowIndex}
                onClick={() => handleRowClick(item)}
                style={item.link ? { cursor: 'pointer' } : {}}>
                {isNumbering && (
                  <td className={getRankingClass(rowIndex + 1)}>
                    {isRanking && rowIndex < 3 ? '' : rowIndex + 1 }
                  </td>
                )}
                {keys.map((key, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className={COLUMN_CLASSES[columnClasses[isNumbering ? colIndex + 1 : colIndex]]}>
                    {renderCellValue(item[key])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Math.max(1, isNumbering ? keys.length + 1 : keys.length)}>
                {error || "Không có dữ liệu để hiển thị"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const renderCellValue = (value: any): string | JSX.Element => {
  if (React.isValidElement(value)) return value; // ✅ Nếu là JSX, render luôn
  if (typeof value === 'boolean') return value ? '✓' : '✗';
  if (value === null || value === undefined) return 'N/A';
  return value.toString();
};


/**
 * Thông tin đầy đủ trong `ListTable.tsx`
 * @module ListTable
 */
export default React.memo(ListTable);
