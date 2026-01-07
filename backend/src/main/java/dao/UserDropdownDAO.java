package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import service.HttpJson;

public class UserDropdownDAO {
	public static String getMonTuChon(Connection conn) {
		String sql = "Select mon_nn, name from mon_hoc where loai_mon = 2";
		
		StringBuilder jsonArray = new StringBuilder();
		jsonArray.append("[");
		
		try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

			ResultSet rs = stmt.executeQuery();
			boolean first = true;

			while (rs.next()) {
				if (!first) {
					jsonArray.append(",");
				} else {
					first = false;
				}

				jsonArray.append("{").append("\"value\":\"").append(rs.getString("mon_nn")).append("\",").append("\"label\":\"")
						.append(HttpJson.convertStringToJson(rs.getString("name"))).append("\"").append("}");
			}

		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi truy vấn dữ liệu người dùng: " + e.getMessage(), e);
		}
		
		jsonArray.append("]");
		return jsonArray.toString();
	}
	
	public static String getMonNgoaiNgu(Connection conn) {
		String sql = "Select mon_nn, name from mon_hoc where loai_mon = 3";
		
		StringBuilder jsonArray = new StringBuilder();
		jsonArray.append("[");
		
		try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

			ResultSet rs = stmt.executeQuery();
			boolean first = true;

			while (rs.next()) {
				if (!first) {
					jsonArray.append(",");
				} else {
					first = false;
				}

				jsonArray.append("{").append("\"value\":\"").append(rs.getString("mon_nn")).append("\",").append("\"label\":\"")
						.append(HttpJson.convertStringToJson(rs.getString("name"))).append("\"").append("}");
			}

		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi truy vấn dữ liệu người dùng: " + e.getMessage(), e);
		}
		
		jsonArray.append("]");
		return jsonArray.toString();
	}
	
	public static String getMonHoc(Connection conn) {
		String sql = "Select mon_nn, name from mon_hoc";
		
		StringBuilder jsonArray = new StringBuilder();
		jsonArray.append("[");
		
		try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

			ResultSet rs = stmt.executeQuery();
			boolean first = true;

			while (rs.next()) {
				if (!first) {
					jsonArray.append(",");
				} else {
					first = false;
				}

				jsonArray.append("{").append("\"value\":\"").append(rs.getString("mon_nn")).append("\",").append("\"label\":\"")
						.append(HttpJson.convertStringToJson(rs.getString("name"))).append("\"").append("}");
			}

		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi truy vấn dữ liệu người dùng: " + e.getMessage(), e);
		}
		
		jsonArray.append("]");
		return jsonArray.toString();
	}
}
