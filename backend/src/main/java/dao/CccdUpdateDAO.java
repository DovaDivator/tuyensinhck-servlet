package dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

import service.ConvertCus;
import service.HttpJson;

public class CccdUpdateDAO {
	public static boolean updateCccd(Connection conn, String id, String numCccd, String dateBirth, String gender,
			String address, String frontImg, String backImg) throws Exception {
		String checkConfirmSql = "SELECT is_confirm FROM stu_cccd WHERE stu_id = ?";
		String checkDuplicateSql = "SELECT stu_id FROM stu_cccd WHERE num_cccd = ? AND stu_id <> ?";
		String updateSql = "UPDATE stu_cccd SET num_cccd = ?, date_of_birth = ?, gender = ?, address = ?, front_cccd = ?, back_cccd = ? WHERE stu_id = ?";
        String insertSql = "INSERT INTO stu_cccd (stu_id, num_cccd, date_of_birth, gender, address, front_cccd, back_cccd, is_confirm) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, 0)";


		try (PreparedStatement duplicatestmt = conn.prepareStatement(checkDuplicateSql)) {
			duplicatestmt.setString(1, numCccd);
			duplicatestmt.setString(2, id);
			ResultSet rs = duplicatestmt.executeQuery();
			if (rs.next()) {
				throw new SQLException("Số CCCD đã tồn tại.");
			}
		}

		try (PreparedStatement confirmstmt = conn.prepareStatement(checkConfirmSql)) {
			confirmstmt.setString(1, id);
			ResultSet rs = confirmstmt.executeQuery();

			if (rs.next()) {
                int isConfirm = rs.getInt("is_confirm");
                if (isConfirm == 1) {
                    throw new SQLException("CCCD đã được xác nhận, không thể sửa.");
                } 
        		try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
        			updateStmt.setString(1, numCccd);
        			updateStmt.setDate(2, ConvertCus.convertStringToSqlDate(dateBirth, "dd/MM/yyyy"));
        			updateStmt.setInt(3, Integer.parseInt(gender));
        			updateStmt.setString(4, address);
        			updateStmt.setBytes(5, ConvertCus.decodeBase64(frontImg));
        			updateStmt.setBytes(6, ConvertCus.decodeBase64(backImg));
        			updateStmt.setString(7, id);
        			
        			int rowsAffected = updateStmt.executeUpdate();

        			if (rowsAffected > 0) {
        				return true;
        			}
        			return false;
        		}

			} else {
            	try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                    insertStmt.setString(1, id);
                    insertStmt.setString(2, numCccd);
                    insertStmt.setDate(3, ConvertCus.convertStringToSqlDate(dateBirth, "dd/MM/yyyy"));
                    insertStmt.setInt(4, Integer.parseInt(gender));
                    insertStmt.setString(5, address);
        			insertStmt.setBytes(6, ConvertCus.decodeBase64(frontImg));
        			insertStmt.setBytes(7, ConvertCus.decodeBase64(backImg));
                    
                    int inserted = insertStmt.executeUpdate();
                    if (inserted > 0) {
                    	return true;
                    }
                    return false;
                    }
                }
            }
		
        }
	
     public static JSONObject getCccdById (Connection conn, String id) throws Exception {
         String getCccdsql = "SELECT num_cccd, date_of_birth, gender, address, front_cccd, back_cccd, is_confirm FROM stu_cccd WHERE stu_id = ? LIMIT 1";
 		 JSONObject cccdJson = new JSONObject();
         
 		try (PreparedStatement stmt = conn.prepareStatement(getCccdsql)) {
			stmt.setString(1, id);
			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				cccdJson.put("numCccd", rs.getString("num_cccd"));
				
				Date date = rs.getDate("date_of_birth");
				String timeConverted = HttpJson.convertTime(date, "yyyy-MM-dd");
				cccdJson.put("dateBirth", timeConverted);
				
				cccdJson.put("gender", rs.getString("gender"));
				cccdJson.put("address", rs.getString("address"));

				byte[] frontImgBytes = rs.getBytes("front_cccd");
				String base64Front = HttpJson.convertToBase64(frontImgBytes);
				cccdJson.put("front", base64Front.isEmpty() ? JSONObject.NULL : base64Front);
				
				byte[] backImgBytes = rs.getBytes("back_cccd");
				String base64Back = HttpJson.convertToBase64(backImgBytes);
				cccdJson.put("back", base64Back.isEmpty() ? JSONObject.NULL : base64Back);
				
				cccdJson.put("confirm", rs.getInt("is_confirm"));

     } else {
			cccdJson.put("confirm", -3000);
     }
	}
	return cccdJson;
}

public static JSONObject selectCccd (Connection conn, String id) throws Exception {
    String sql = "SELECT u.name as real_name, c.num_cccd, c.date_of_birth, c.gender, c.address, c.front_cccd, c.back_cccd, c.is_confirm FROM stu_cccd c JOIN users u ON c.stu_id = u.id WHERE c.stu_id = ? LIMIT 1";
	 JSONObject selectJson = new JSONObject();
    
	try (PreparedStatement stmt = conn.prepareStatement(sql)) {
		stmt.setString(1, id);
		ResultSet rs = stmt.executeQuery();

		if (rs.next()) {
			selectJson.put("realName", HttpJson.convertStringToJson(rs.getString("real_name")));
			selectJson.put("numCccd", rs.getString("num_cccd"));
			
			Date date = rs.getDate("date_of_birth");
			String timeConverted = HttpJson.convertTime(date, "yyyy-MM-dd");
			selectJson.put("dateBirth", timeConverted);
			
			selectJson.put("gender", rs.getString("gender"));
			selectJson.put("address", rs.getString("address"));

			byte[] frontImgBytes = rs.getBytes("front_cccd");
			String base64Front = HttpJson.convertToBase64(frontImgBytes);
			selectJson.put("front", base64Front.isEmpty() ? JSONObject.NULL : base64Front);
			
			byte[] backImgBytes = rs.getBytes("back_cccd");
			String base64Back = HttpJson.convertToBase64(backImgBytes);
			selectJson.put("back", base64Back.isEmpty() ? JSONObject.NULL : base64Back);
			
			selectJson.put("confirm", rs.getInt("is_confirm"));

} else {
		selectJson.put("confirm", -3000);
       }
     }
return selectJson;
}


public static boolean acceptCccd (Connection conn, String id, String realName, String numCccd, String dateBirth, String gender,
		String address, String frontImg, String backImg) throws Exception {
    PreparedStatement stmt1 = null;
    PreparedStatement stmt2 = null;
    
        		try  {
                    conn.setAutoCommit(false);
                    
                    //1. Cập nhật users
                    String updateUserSql = "UPDATE users SET name = ? WHERE id = ?";
                    stmt1 = conn.prepareStatement(updateUserSql);
        	        stmt1.setString(1, realName);
        	        stmt1.setString(2, id);
        	        int updatedUser = stmt1.executeUpdate();
        	        
        	        if (updatedUser == 0) {
        	        	throw new SQLException ("Cập nhật dữ liệu người dùng không thành công.");
        	        }
        	        
        	        
        	        //2. Cập nhật CCCD
        	        String updateCccdSql = "UPDATE stu_cccd SET num_cccd = ?, date_of_birth = ?, gender = ?, address = ?, front_cccd = ?, back_cccd = ?, is_confirm = 1 WHERE stu_id = ?";
        	        stmt2 = conn.prepareStatement(updateCccdSql);
        	        stmt2.setString(1, numCccd);
        	        stmt2.setDate(2, ConvertCus.convertStringToSqlDate(dateBirth, "dd/MM/yyyy"));
        	        stmt2.setInt(3, Integer.parseInt(gender));
        	        stmt2.setString(4, address);
        	        stmt2.setBytes(5, ConvertCus.decodeBase64(frontImg));
        	        stmt2.setBytes(6, ConvertCus.decodeBase64(backImg));
        	        stmt2.setString(7, id);
        	        int updatedCccd = stmt2.executeUpdate();
        	        
        	        if (updatedCccd == 0) {
        	        	throw new SQLException ("Cập nhật dữ liệu CCCD không thành công.");
        	        }
        	        
        
                    conn.commit();
                    return true;
                    
                } catch (Exception e) {
                    try {
                        if (conn != null) conn.rollback();
                    } catch (SQLException rollbackEx) {
                        rollbackEx.printStackTrace();
                    }
                    e.printStackTrace();
                    return false;

                } finally {
                    try {
                        if (conn != null) conn.setAutoCommit(true);
                        if (stmt1 != null) stmt1.close();
                        if (stmt2 != null) stmt2.close();
                    } catch (SQLException ex) {
                        ex.printStackTrace();
                    }
                }
            }
        

public static boolean denyCccd (Connection conn, String id) throws Exception {
    PreparedStatement denyStmt = null;
    		
        		try  {
                    conn.setAutoCommit(false);
                    
                    String denySql = "UPDATE stu_cccd SET is_confirm = -1 WHERE stu_id = ?";
                    denyStmt = conn.prepareStatement(denySql);
                    denyStmt.setString(1, id);
        	        
                    int updatedDeny = denyStmt.executeUpdate();
        	        if (updatedDeny == 0) {
        	        	throw new SQLException ("Không tìm thấy CCCD để từ chối.");
        	        }
        	              
        
                    conn.commit();
                    return true;
                    
                } catch (Exception e) {
                    try {
                        if (conn != null) conn.rollback();
                    } catch (SQLException rollbackEx) {
                        rollbackEx.printStackTrace();
                    }
                    e.printStackTrace();
                    return false;

                } finally {
                    try {
                        if (conn != null) conn.setAutoCommit(true);
                        if (denyStmt != null) denyStmt.close();
                    } catch (SQLException ex) {
                        ex.printStackTrace();
                    }
                }
            }
        

public static boolean removeCccd(Connection conn, String id) throws Exception {
    String deleteSql = "DELETE FROM stu_cccd WHERE stu_id = ?";
    try (PreparedStatement stmt = conn.prepareStatement(deleteSql)) {
        stmt.setString(1, id);
        int rowsAffected = stmt.executeUpdate();
        return rowsAffected > 0;
    }
}


public static int confirmStudent (Connection conn, String id) throws Exception {
	String isConfirmSql = "SELECT is_confirm FROM stu_cccd WHERE stu_id = ?";
	try (PreparedStatement stmt = conn.prepareStatement(isConfirmSql)) {
		stmt.setString (1, id);
		ResultSet rs = stmt.executeQuery();
		if (rs.next() ) {
			return rs.getInt("is_confirm");
		} else {
			return -3000;
		}
	}
}
}