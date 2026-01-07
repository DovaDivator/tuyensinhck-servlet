package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import org.json.JSONObject;

import service.HttpJson;

public class UserInfoDAO {
	public static JSONObject fetchUserData(Connection conn, String userId) throws Exception {
		JSONObject userJson = new JSONObject();
		String sql = "SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1";

		try (PreparedStatement stmt = conn.prepareStatement(sql)) {
			stmt.setString(1, userId);
			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				userJson.put("id", rs.getString("id"));
				userJson.put("name", rs.getString("name"));
				userJson.put("role", rs.getInt("role"));
				userJson.put("email", rs.getString("email"));
				userJson.put("phone", rs.getString("phone"));

				userJson.put("avatarImg", JSONObject.NULL);

				Timestamp timestamp = rs.getTimestamp("created_at");
				String timeConverted = HttpJson.convertTime(timestamp, "yyyy-MM-dd'T'HH:mm:ss");
				userJson.put("created_at", timeConverted);
			}
		}

		return userJson;
	}
}
