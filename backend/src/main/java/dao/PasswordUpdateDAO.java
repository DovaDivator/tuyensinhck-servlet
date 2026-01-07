package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class PasswordUpdateDAO {
    public static boolean updatePassword(Connection conn, String id, String curPass, String newPass) throws SQLException {
        String checkSql = "SELECT * FROM users WHERE id = ?";
        String updateSql = "UPDATE users SET password = ? WHERE id = ? and password = ?";

        try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
            checkStmt.setString(1, id);
            ResultSet rs = checkStmt.executeQuery();

            if (!rs.next()) {
                throw new SQLException("Không tìm thấy người dùng với ID: " + id);
            }

        }

        try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
            updateStmt.setString(1, newPass);
            updateStmt.setString(2, id);
            updateStmt.setString(3, curPass);
            int rowsAffected = updateStmt.executeUpdate();

            if (rowsAffected > 0) {
                return true;
            }
            return false;
        }
    }
}