/**
 * Định dạng một dấu thời gian (timestamp) thành định dạng ngày được chỉ định.
 * @param timestamp - Một chuỗi hoặc số đại diện cho một dấu thời gian hợp lệ (ví dụ: chuỗi ngày theo chuẩn ISO, hoặc dấu thời gian Unix tính bằng mili-giây).
 * @param format - Một chuỗi xác định định dạng đầu ra mong muốn. Mặc định là "DD/MM/YYYY".
 * @returns Một chuỗi đại diện cho ngày đã được định dạng theo định dạng được chỉ định.
 * @throws Lỗi nếu timestamp không hợp lệ, là null, undefined, hoặc không thể phân tích (parse).
 * @example
 * formatTimestamp("2025-05-03T12:00:00Z") // Returns "03/05/2025"
 * formatTimestamp(1743619200000, "YYYY-MM-DD") // Returns "2025-05-03"
 */
export const formatTimestamp = (
  timestamp: string | number | Date,
  format: string = "DD/MM/YYYY"
): string => {
  // Validate input
  if (!timestamp && timestamp !== 0) {
    throw new Error("Timestamp is required and cannot be null or undefined");
  }

  const date = new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp provided");
  }

  // Format date components with zero-padding
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");


  // Replace format placeholders
  return format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};