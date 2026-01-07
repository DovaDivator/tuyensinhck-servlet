package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class RegisterDAO {
	public static boolean processRegister(Connection conn, String name, String email, String phone, String password) throws Exception {
        // Chuẩn bị câu lệnh INSERT
        String sql = "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setString(3, phone);
            stmt.setString(4, password);
            stmt.setInt(5, 1); // Gán role = 1 (sinh viên), trigger sẽ sinh ID

            int rowsInserted = stmt.executeUpdate();
            return rowsInserted > 0; // Trả về true nếu có ít nhất một dòng được chèn
    }
}
}
