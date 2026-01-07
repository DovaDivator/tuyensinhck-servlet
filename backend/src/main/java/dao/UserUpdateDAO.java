package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UserUpdateDAO {
	public static boolean updateUser(Connection conn, String name, String value, String userId) throws SQLException {
        String sql = "UPDATE users SET " + name + " = ? WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, value);
            stmt.setString(2, userId);
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
	
	public static boolean setFreezeStatus(Connection conn, String id) throws SQLException {
	    String sql = "UPDATE users SET is_freezing = CASE WHEN is_freezing = '1' THEN '0' ELSE '1' END WHERE id = ?";
	    try (PreparedStatement stmt = conn.prepareStatement(sql)) {
	        stmt.setString(1, id);
	        int rowsAffected = stmt.executeUpdate();
	        return rowsAffected > 0;
	    }
	}
	
	public static boolean deleteCccd(Connection conn, String id) throws SQLException {
		String sql = "DELETE FROM stu_cccd WHERE stu_id = ?";
	    try (PreparedStatement stmt = conn.prepareStatement(sql)) {
	        stmt.setString(1, id);
	        int rowsAffected = stmt.executeUpdate();
	        return rowsAffected > 0;
	    }
	}
	
	public static boolean deleteThiSinh(Connection conn, String id) throws SQLException {
		String sql = "DELETE FROM thi_cu WHERE stu_id = ?";
	    try (PreparedStatement stmt = conn.prepareStatement(sql)) {
	        stmt.setString(1, id);
	        int rowsAffected = stmt.executeUpdate();
	        return rowsAffected > 0;
	    }
	}
	
	public static boolean updateGVMon(Connection conn, String id, String mon) throws SQLException {
		String sql = "UPDATE tch_mgr SET mon_nn = ? where tch_id = ?";
	    try (PreparedStatement stmt = conn.prepareStatement(sql)) {
	    	if (mon == null || mon.trim().isEmpty()) {
	            stmt.setNull(1, java.sql.Types.VARCHAR);
	        } else {
	            stmt.setString(1, mon);
	        }
	        stmt.setString(2, id);
	        int rowsAffected = stmt.executeUpdate();
	        return rowsAffected > 0;
	    }
	}

}
