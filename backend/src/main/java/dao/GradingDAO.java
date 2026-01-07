package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;

public class GradingDAO {
	public static JSONObject gradeExamList(Connection conn, String he, int khoa, String mon) throws SQLException {
		JSONObject res = new JSONObject();
		
		if(mon.isEmpty() || he.isEmpty()) {
//			System.out.println(1);
			return new JSONObject();
		}
			
		int loai_mon = -1;
		String tenMon;
		String preSql1 = "Select loai_mon, name from mon_hoc where mon_nn = ?";
		try(PreparedStatement preStmt = conn.prepareStatement(preSql1)){
			preStmt.setString(1, mon);
			ResultSet rs = preStmt.executeQuery();
			if(rs.next()) {
				loai_mon = rs.getInt("loai_mon");
				tenMon = rs.getString("name");
			} else {
//				System.out.println(2);
				return new JSONObject(); // No matching subject found
			}
		}
		
		String preSql2 = "select khoa, close_exam from ky_thi_history where loai_thi = ?";
		try(PreparedStatement preStmt = conn.prepareStatement(preSql2)){
			preStmt.setString(1, he);
			ResultSet rs = preStmt.executeQuery();
			if(rs.next()) {
				int temp_khoa = rs.getInt("khoa");
				if(khoa == -1 || khoa > temp_khoa) khoa = temp_khoa;
				Date date = rs.getDate("close_exam");
				if(date.before(new Date())) {
					res.put("allow", false);
				}else {
					res.put("allow", true);
				}
			} else {
//				System.out.println(3);
				return new JSONObject(); // No matching subject found
			}
		}
		
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT tc.exam_id, ");
		switch(loai_mon) {
			case 0:
				sql.append("tc.diem_toan as diem, (select ds.ma_phong from ds_thi ds where ds.exam_id = tc.exam_id and mon_thi = 1) as ma_phong ");
				break;
			case 1:
				sql.append("tc.diem_van as diem, (select ds.ma_phong from ds_thi ds where ds.exam_id = tc.exam_id and mon_thi = 2) as ma_phong ");
				break;
			case 2:
				sql.append("tc.diem_tc as diem, (select ds.ma_phong from ds_thi ds where ds.exam_id = tc.exam_id and mon_thi = 3) as ma_phong ");
				break;
			case 3:
				sql.append("tc.diem_nn as diem, (select ds.ma_phong from ds_thi ds where ds.exam_id = tc.exam_id and mon_thi = 4) as ma_phong ");
				break;
			default:
				return new JSONObject(); // Invalid subject type
		}
		
		sql.append("from thi_cu tc where tc.he = ? and tc.khoa = ? ");
		
		if(loai_mon == 2) {
			sql.append(" and mon_tc = '" + mon + "' ");
		}
		
		if(loai_mon == 3) {
			sql.append(" and mon_nn = '" + mon + "' ");
		}
		
		sql.append(" order by ma_phong, tc.exam_id");
		try(PreparedStatement stmt = conn.prepareStatement(sql.toString())){
			stmt.setString(1, he);
			stmt.setInt(2, khoa);
			ResultSet rs = stmt.executeQuery();
			JSONArray result = new JSONArray();
			
			while(rs.next()) {
				JSONObject row = new JSONObject();
				row.put("examId", rs.getString("exam_id"));
				row.put("maPhong", rs.getString("ma_phong"));
				row.put("monThi", tenMon);
				double diem = rs.getDouble("diem");
				if (rs.wasNull()) {
				    row.put("diem", JSONObject.NULL);  // hoặc null nếu bạn muốn
				} else {
				    row.put("diem", diem);
				}
				result.put(row);
			}
			
			res.put("list", result);
			return res;			
		}		
	}
	
	public static boolean updateGrading(Connection conn, String he, int khoa, String mon, JSONObject data) throws Exception {	
		if(mon.isEmpty() || he.isEmpty()) {
//			System.out.println(1);
			throw new Exception("Môn hoặc hệ đang để trống");
		}
		
		int loai_mon = -1;
		String preSql1 = "Select loai_mon from mon_hoc where mon_nn = ?";
		try(PreparedStatement preStmt = conn.prepareStatement(preSql1)){
			preStmt.setString(1, mon);
			ResultSet rs = preStmt.executeQuery();
			if(rs.next()) {
				loai_mon = rs.getInt("loai_mon");
			} else {
//				System.out.println(2);
				throw new Exception("Mã môn không được chấp nhận"); // No matching subject found
			}
		}
		
		String preSql2;
		if (khoa != -1) {
		    preSql2 = "SELECT close_exam FROM ky_thi_history WHERE loai_thi = ? AND khoa = ?";
		} else {
		    preSql2 = "SELECT close_exam FROM ky_thi_history WHERE loai_thi = ? ORDER BY khoa DESC LIMIT 1";
		}

		try (PreparedStatement preStmt = conn.prepareStatement(preSql2)) {
		    preStmt.setString(1, he);
		    
		    if (khoa != -1) {
		        preStmt.setInt(2, khoa);
		    }
		    
		    ResultSet rs = preStmt.executeQuery();
		    if (rs.next()) {
		        Date date = rs.getDate("close_exam");
		        if (date.before(new Date())) {
		            return false;
		        }
		    } else {
		        throw new Exception("Kỳ thi này chưa tồn tại");
		    }
		}
		
		 String updateSql;
		 switch(loai_mon) {
			case 0:
				updateSql = "UPDATE thi_cu SET diem_toan = ? WHERE exam_id = ?";
				break;
			case 1:
				updateSql = "UPDATE thi_cu SET diem_van = ? WHERE exam_id = ?";
				break;
			case 2:
				updateSql = "UPDATE thi_cu SET diem_tc = ? WHERE exam_id = ?";
				break;
			case 3:
				updateSql = "UPDATE thi_cu SET diem_nn = ? WHERE exam_id = ?";
				break;
			default:
				throw new Exception("Loại thi không phù hợp");// Invalid subject type
		}
		    conn.setAutoCommit(false);
		    try (PreparedStatement pstmt = conn.prepareStatement(updateSql)) {
		        for (String key : data.keySet()) {
		            try {
		                Double diem = data.getDouble(key); // Lấy value (điểm)
		                pstmt.setDouble(1, diem);       // set diem
		                pstmt.setString(2, key);     // set exam_id
		                int affectedRows = pstmt.executeUpdate();

		                if (affectedRows == 0) {
		                    throw new SQLException("Không tìm thấy exam_id: " + key);
		                }
		            } catch (Exception ex) {
		                // Nếu lỗi bất kỳ, rollback và throw lỗi chi tiết
		                conn.rollback();
		                throw new Exception("Lỗi khi cập nhật exam_id " + key + ": " + ex.getMessage());
		            }
		        }

		        conn.commit(); // Thành công hết thì commit
		    } catch (Exception e) {
		        conn.rollback(); // Bất kỳ lỗi nào cũng rollback
		        throw e;         // Ném lỗi ra ngoài để xử lý
		    } finally {
		        conn.setAutoCommit(true); // Reset trạng thái autoCommit
		    }
		
		return true;
	}
}
