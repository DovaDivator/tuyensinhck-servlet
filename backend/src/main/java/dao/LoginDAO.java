package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import model.UserBasic;

public class LoginDAO {
	public static UserBasic findUserByLogin(Connection conn, String username, String password) throws SQLException {
        String sql = "SELECT id, name, role FROM users " +
                     "WHERE (email = ? OR phone = ?) AND password = ? AND is_freezing = 0 LIMIT 1";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, username);
            stmt.setString(3, password);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new UserBasic(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getInt("role"),
                        null // avatar chưa cần
                    );
                } else {
                    return UserBasic.NULL; // không tìm thấy user
                }
            }
        }
      }
}
