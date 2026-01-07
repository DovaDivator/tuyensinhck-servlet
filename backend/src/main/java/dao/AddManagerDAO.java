package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AddManagerDAO {
    public static boolean addTeacher(Connection conn, String name, String email, String phone, String password, String mon) {
        PreparedStatement stmt1 = null;
        PreparedStatement stmt2 = null;
        PreparedStatement stmtGetId = null;
        ResultSet rs = null;

        try {
            conn.setAutoCommit(false);

            // 1. Thêm vào bảng users
            String sql1 = "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 2)";
            stmt1 = conn.prepareStatement(sql1);
            stmt1.setString(1, name);
            stmt1.setString(2, email);
            if (phone == null || phone.trim().isEmpty()) {
	            stmt1.setNull(3, java.sql.Types.VARCHAR);
	        } else {
	            stmt1.setString(3, phone);
	        }
            stmt1.setString(4, password);
            stmt1.executeUpdate();

            // 2. Lấy id của giáo viên vừa thêm (dựa vào email)
            String sqlGetId = "SELECT id FROM users WHERE email = ? AND role = 2";
            stmtGetId = conn.prepareStatement(sqlGetId);
            stmtGetId.setString(1, email);
            rs = stmtGetId.executeQuery();

            String teacherId = null;
            if (rs.next()) {
                teacherId = rs.getString("id");
            } else {
                throw new SQLException("Không tìm thấy ID của giáo viên sau khi thêm.");
            }

            // 3. Thêm môn quản lý vào bảng tch_mgr
            String sql2 = "INSERT INTO tch_mgr (tch_id, mon_nn) VALUES (?, ?)";
            stmt2 = conn.prepareStatement(sql2);
            stmt2.setString(1, teacherId);
            if (mon == null || mon.trim().isEmpty()) {
	            stmt2.setNull(2, java.sql.Types.VARCHAR);
	        } else {
	            stmt2.setString(2, mon);
	        }
            stmt2.executeUpdate();

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
                if (rs != null) rs.close();
                if (stmt1 != null) stmt1.close();
                if (stmtGetId != null) stmtGetId.close();
                if (stmt2 != null) stmt2.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
}
