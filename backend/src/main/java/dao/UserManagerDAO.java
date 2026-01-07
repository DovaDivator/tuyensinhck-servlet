package dao;

import static util.GlobleVariables.ADMIN_LIST_USER_LIMIT;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.json.JSONArray;
import org.json.JSONObject;

import service.HttpJson;

public class UserManagerDAO {
	public static String getTaiKhoanQuery() {
		return "SELECT u.id, u.name, u.created_at, u.is_freezing, "
		           + "COALESCE((SELECT c.is_confirm FROM stu_cccd c WHERE c.stu_id = u.id LIMIT 1), -3000) as isxacthuc "
		           + "FROM users u "
		           + "WHERE u.role = 1";
	}

	public static JSONArray getTaiKhoan(Connection conn, String search, String isCccd, String isFreeze, int page) {
		int offset = (page - 1) * ADMIN_LIST_USER_LIMIT;

		StringBuilder sql = new StringBuilder();
		sql.append("SELECT * FROM ( ");
		sql.append(getTaiKhoanQuery());
		sql.append(") AS sub WHERE 1=1 ");

		if (!search.isEmpty()) {
			sql.append(" AND (u.name LIKE ? OR u.id LIKE ?) ");
		}

		if (isCccd.equals("true") || isCccd.equals("false"))
			sql.append(" AND isxacthuc = ").append(isCccd);

		if (isFreeze.equals("true") || isFreeze.equals("false"))
			sql.append(" AND is_freezing = ").append(isFreeze);

		sql.append(" LIMIT ").append(ADMIN_LIST_USER_LIMIT).append(" OFFSET ").append(offset);

		JSONArray jsonArray = new JSONArray();

		try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
			if (!search.isEmpty()) {
				String like = "%" + search + "%";
				stmt.setString(1, like);
				stmt.setString(2, like);
			}

			ResultSet rs = stmt.executeQuery();

			while (rs.next()) {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("id", rs.getString("id"));
				jsonObject.put("name", HttpJson.convertStringToJson(rs.getString("name")));
				jsonObject.put("created_at", HttpJson.convertTime(rs.getTimestamp("created_at"), "HH:mm dd/MM/yyyy"));
				jsonObject.put("isxacthuc", rs.getInt("isxacthuc"));
				jsonObject.put("isFreeze", rs.getBoolean("is_freezing"));

				jsonArray.put(jsonObject);
			}

		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi truy vấn dữ liệu người dùng: " + e.getMessage(), e);
		}

		return jsonArray;
	}

	public static JSONObject getTaiKhoanTotalPage(Connection conn, String search, String isCccd, String isFreeze) {
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT COUNT(*) FROM (");
		sql.append("SELECT * FROM ( ");
		sql.append(getTaiKhoanQuery());
		sql.append(") AS sub WHERE 1=1 ");

		if (!search.isEmpty()) {
			sql.append(" AND (name LIKE ? OR id LIKE ?) ");
		}

		if (isCccd.equals("true") || isCccd.equals("false"))
			sql.append(" AND isxacthuc = ").append(isCccd);

		if (isFreeze.equals("true") || isFreeze.equals("false"))
			sql.append(" AND is_freezing = ").append(isFreeze);

		sql.append(") AS total_list");

		JSONObject jsonResult = new JSONObject();

		try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
			if (!search.isEmpty()) {
				String like = "%" + search + "%";
				stmt.setString(1, like);
				stmt.setString(2, like);
			}

			ResultSet rs = stmt.executeQuery();

			int listLength = 0;
			if (rs.next()) {
				listLength = rs.getInt(1); // lấy giá trị COUNT(*)
			}

			int totalPage = HttpJson.getTotalPage(listLength, ADMIN_LIST_USER_LIMIT);
			jsonResult.put("totalPage", totalPage);

		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi truy vấn tổng số trang người dùng: " + e.getMessage(), e);
		}

		return jsonResult;
	}

	public static String getThiSinhQuery() {
		return "select tc.stu_id, " + "(select u.name from users u where u.id = tc.stu_id) as name, "
				+ "tc.exam_id, tc.he, tc.mon_tc, tc.mon_nn, "
				+ "(select mh.name from mon_hoc mh where mh.mon_nn = tc.mon_nn) as mon_nn_name, "
				+ "(select mh.name from mon_hoc mh where mh.mon_nn = tc.mon_tc) as mon_tc_name, "
				+ "(select dt.khoa_thi from ds_thi dt where dt.exam_id = tc.exam_id) as khoa_thi, "
				+ "(select dt.ma_phong from ds_thi dt where dt.exam_id = tc.exam_id and dt.ma_ca = 1) as phong1, "
				+ "(select dt.ma_phong from ds_thi dt where dt.exam_id = tc.exam_id and dt.ma_ca = 2) as phong2, "
				+ "(select dt.ma_phong from ds_thi dt where dt.exam_id = tc.exam_id and dt.ma_ca = 3) as phong3, "
				+ "(select dt.ma_phong from ds_thi dt where dt.exam_id = tc.exam_id and dt.ma_ca = 4) as phong4 "
				+ "from thi_cu tc";
	}

	public static JSONArray getThiSinh(Connection conn, String search, String optionHe, String optionKhoaThi,
			String optionTc, String optionNn, int page) {
		int offset = (page - 1) * ADMIN_LIST_USER_LIMIT;

		StringBuilder sql = new StringBuilder();
		sql.append("SELECT * FROM ( ");
		sql.append(getThiSinhQuery());
		sql.append(") AS sub WHERE 1=1 ");

		if (!search.isEmpty())
			sql.append(" AND (name LIKE ? OR stu_id LIKE ? OR exam_id LIKE ?) ");

		if (!optionHe.isEmpty())
			sql.append(" AND he = ").append(optionHe);

		if (!optionKhoaThi.isEmpty() && !optionKhoaThi.equals("0"))
			sql.append(" AND khoa_thi = ").append(optionKhoaThi);

		if (!optionTc.isEmpty())
			sql.append(" AND mon_tc = '").append(optionTc).append("'");

		if (!optionNn.isEmpty())
			sql.append(" AND mon_nn = '").append(optionNn).append("'");

		sql.append(" LIMIT ").append(ADMIN_LIST_USER_LIMIT).append(" OFFSET ").append(offset);

		JSONArray jsonArray = new JSONArray();

		try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
			if (!search.isEmpty()) {
				String like = "%" + search + "%";
				stmt.setString(1, like);
				stmt.setString(2, like);
				stmt.setString(3, like);
			}

			ResultSet rs = stmt.executeQuery();

			while (rs.next()) {
				JSONObject json = new JSONObject();
				json.put("stu_id", rs.getString("stu_id"));
				json.put("name", HttpJson.convertStringToJson(rs.getString("name")));
				json.put("exam_id", rs.getString("exam_id"));
				json.put("he", rs.getInt("he"));
				json.put("mon_tc", HttpJson.convertStringToJson(rs.getString("mon_tc_name")));
				json.put("mon_nn", HttpJson.convertStringToJson(rs.getString("mon_nn_name")));
				json.put("khoa_thi", rs.getInt("khoa_thi"));
				json.put("phong1", rs.getString("phong1"));
				json.put("phong2", rs.getString("phong2"));
				json.put("phong3", rs.getString("phong3"));
				json.put("phong4", rs.getString("phong4"));

				jsonArray.put(json);
			}

		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi truy vấn dữ liệu thí sinh: " + e.getMessage(), e);
		}

		return jsonArray;
	}

	public static JSONObject getThiSinhTotalPage(Connection conn, String search, String optionHe, String optionKhoaThi,
			String optionTc, String optionNn) {
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT COUNT(*) FROM (");
		sql.append("SELECT * FROM ( ");
		sql.append(getThiSinhQuery());
		sql.append(") AS sub WHERE 1=1 ");

		if (!search.isEmpty())
			sql.append(" AND (name LIKE ? OR stu_id LIKE ? OR exam_id LIKE ?) ");

		if (!optionHe.isEmpty())
			sql.append(" AND he = ").append(optionHe);

		if (!optionKhoaThi.isEmpty())
			sql.append(" AND khoa_thi = ").append(optionKhoaThi);

		if (!optionTc.isEmpty())
			sql.append(" AND mon_tc = '").append(optionTc).append("'");

		if (!optionNn.isEmpty())
			sql.append(" AND mon_nn = '").append(optionNn).append("'");

		sql.append(") as total_list");

		JSONObject jsonResult = new JSONObject();

		try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
			if (!search.isEmpty()) {
				String like = "%" + search + "%";
				stmt.setString(1, like);
				stmt.setString(2, like);
				stmt.setString(3, like);
			}

			ResultSet rs = stmt.executeQuery();

			int listLength = 0;
			if (rs.next()) {
				listLength = rs.getInt(1);
			}

			int totalPage = HttpJson.getTotalPage(listLength, ADMIN_LIST_USER_LIMIT);
			jsonResult.put("totalPage", totalPage);

		} catch (Exception e) {
			throw new RuntimeException("Lỗi khi truy vấn tổng số trang thí sinh: " + e.getMessage(), e);
		}

		return jsonResult;
	}

	public static String getGiaoVienQuery() {
		return "select u.id, u.name, u.is_freezing, "
				+ "(select tm.mon_nn from tch_mgr tm where tm.tch_id = u.id) as mon_nn, "
				+ "(select mh.name from mon_hoc mh where mh.mon_nn = "
				+ "(select tm.mon_nn from tch_mgr tm where tm.tch_id = u.id) " + ") as ten_mon "
				+ "from users u where u.role = 2";
	}

	public static JSONArray getGiaoVien(Connection conn, String search, String mon, String isFreeze, int page) {
	    int offset = (page - 1) * ADMIN_LIST_USER_LIMIT;

	    StringBuilder sql = new StringBuilder();
	    sql.append("SELECT * FROM ( ");
	    sql.append(getGiaoVienQuery());
	    sql.append(") AS sub WHERE 1=1 ");

	    if (!search.isEmpty())
	        sql.append(" AND (name LIKE ? OR id LIKE ?) ");

	    if (!mon.isEmpty())
	        sql.append(" AND mon_nn = '").append(mon).append("'");

	    if (isFreeze.equals("true") || isFreeze.equals("false"))
	        sql.append(" AND is_freezing = ").append(isFreeze);

	    sql.append(" LIMIT ").append(ADMIN_LIST_USER_LIMIT).append(" OFFSET ").append(offset);

	    JSONArray jsonArray = new JSONArray();

	    try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
	        if (!search.isEmpty()) {
	            String like = "%" + search + "%";
	            stmt.setString(1, like);
	            stmt.setString(2, like);
	        }

	        ResultSet rs = stmt.executeQuery();

	        while (rs.next()) {
	            JSONObject obj = new JSONObject();
	            obj.put("id", rs.getString("id"));
	            obj.put("name", HttpJson.convertStringToJson(rs.getString("name")));
	            obj.put("mon_ql", HttpJson.convertStringToJson(rs.getString("ten_mon")));
	            obj.put("isFreeze", rs.getBoolean("is_freezing"));
	            jsonArray.put(obj);
	        }

	    } catch (Exception e) {
	        throw new RuntimeException("Lỗi khi truy vấn dữ liệu giáo viên: " + e.getMessage(), e);
	    }

	    return jsonArray;
	}

	public static JSONObject getGiaoVienTotalPage(Connection conn, String search, String mon, String isFreeze) {
	    StringBuilder sql = new StringBuilder();
	    sql.append("SELECT COUNT(*) FROM (");
	    sql.append("SELECT * FROM ( ");
	    sql.append(getGiaoVienQuery());
	    sql.append(") AS sub WHERE 1=1 ");

	    if (!search.isEmpty())
	        sql.append(" AND (name LIKE ? OR id LIKE ?) ");

	    if (!mon.isEmpty())
	        sql.append(" AND mon_nn = '").append(mon).append("'");

	    if (isFreeze.equals("true") || isFreeze.equals("false"))
	        sql.append(" AND is_freezing = ").append(isFreeze);

	    sql.append(") as total_list");

	    JSONObject jsonResult = new JSONObject();

	    try (PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
	        if (!search.isEmpty()) {
	            String like = "%" + search + "%";
	            stmt.setString(1, like);
	            stmt.setString(2, like);
	        }

	        ResultSet rs = stmt.executeQuery();

	        int listLength = 0;
	        if (rs.next()) {
	            listLength = rs.getInt(1);
	        }

	        int totalPage = HttpJson.getTotalPage(listLength, ADMIN_LIST_USER_LIMIT);
	        jsonResult.put("totalPage", totalPage);

	    } catch (Exception e) {
	        throw new RuntimeException("Lỗi khi truy vấn tổng số trang giáo viên: " + e.getMessage(), e);
	    }

	    return jsonResult;
	}
}
