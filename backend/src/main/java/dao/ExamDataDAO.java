package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONObject;

public class ExamDataDAO {

    public static JSONArray fetchExamList(Connection conn, String id, String kyThi, String khoa) throws SQLException {
    	StringBuilder sqlBuilder = new StringBuilder();
    	sqlBuilder.append(
    		    "SELECT " +
    		    "  CASE tc.he " +
    		    "    WHEN 'dh' THEN 'Đại học' " +
    		    "    WHEN 'cd' THEN 'Cao đẳng' " +
    		    "    WHEN 'lt' THEN 'Liên thông' " +
    		    "    ELSE 'Không xác định' " +
    		    "  END AS he, " +

    		    "  tc.khoa AS khoa, " +
    		    "  tc.exam_id, tc.id_register, " +

    		    "  (SELECT mh.name FROM mon_hoc mh WHERE mh.mon_nn = tc.mon_nn) AS monNN, " +
    		    "  (SELECT mh.name FROM mon_hoc mh WHERE mh.mon_nn = tc.mon_tc) AS monTC, " +

    		    "  JSON_OBJECT( " +
    		    "    'diemToan', tc.diem_toan, " +
    		    "    'diemVan', tc.diem_van, " +
    		    "    'diemTC', tc.diem_tc, " +
    		    "    'diemNN', tc.diem_nn " +
    		    "  ) AS ketQua, " +

    		    "  ( " +
    		    "    SELECT JSON_ARRAYAGG( " +
    		    "      JSON_OBJECT( " +
    		    "        'ttMon', dst.mon_thi, " +
    		    "        'maPhong', dst.ma_phong, " +
    		    "        'viTri', ( " +
    		    "          SELECT pt.vi_tri " +
    		    "          FROM phong_thi pt " +
    		    "          WHERE pt.ma_phong = dst.ma_phong " +
    		    "        ), " +
    		    "        'dateExam', DATE_FORMAT( DATE_ADD( " +
    		    "          dst.ngay_thi, " +
    		    "          INTERVAL ( " +
    		    "            SELECT ct.delay_day " +
    		    "            FROM ca_thi ct " +
    		    "            WHERE ct.ma_ca = dst.ma_ca " +
    		    "          ) DAY), '%d/%m/%Y' " +
    		    "        ), " +
    		    "        'timeStart', ( " +
    		    "          SELECT DATE_FORMAT(ct.time_start, '%H:%i') " +
    		    "          FROM ca_thi ct " +
    		    "          WHERE ct.ma_ca = dst.ma_ca " +
    		    "        ), " +
    		    "        'timeEnd', ( " +
    		    "          SELECT DATE_FORMAT(ct.time_end, '%H:%i') " +
    		    "          FROM ca_thi ct " +
    		    "          WHERE ct.ma_ca = dst.ma_ca " +
    		    "        ) " +
    		    "      ) " +
    		    "    ) " +
    		    "    FROM ds_thi dst " +
    		    "    WHERE dst.exam_id = tc.exam_id " +
    		    "  ) AS dsThi " +

    		    "FROM thi_cu tc WHERE tc.stu_id = ? ");
    	
    		if (!kyThi.isEmpty()) {
				sqlBuilder.append(" AND tc.he = '" + kyThi + "' ");
			}
    		
    		if (!khoa.isEmpty()) {
    			sqlBuilder.append(" AND tc.khoa = " + khoa + " ");
    		}
    	
    		sqlBuilder.append(" order by tc.id_register desc;");
    		// Prepare the SQL statement
        JSONArray resultArray = new JSONArray();

        try  {
        	PreparedStatement stmt = conn.prepareStatement(sqlBuilder.toString());
        	stmt.setString (1, id);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                JSONObject json = new JSONObject();
                json.put("idRegister", rs.getString("id_register"));
                json.put("he", rs.getString("he"));
                json.put("khoa", rs.getString("khoa"));
                json.put("examId", rs.getString("exam_id"));
                json.put("monNN", rs.getString("monNN"));
                json.put("monTC", rs.getString("monTC"));
                json.put("ketQua", new JSONObject(rs.getString("ketQua")));
                json.put("dsThi", rs.getString("dsThi") != null ? new JSONArray(rs.getString("dsThi")) : new JSONArray());
                resultArray.put(json);
            }
        } catch( SQLException ex ) {
        	ex.printStackTrace();
        	throw ex;
        }

        return resultArray;
    }
    
    public static boolean checkDeadline(Connection conn, String typeExam) throws Exception {
    	String checkTimeSql = "SELECT * FROM ky_thi_mgr WHERE loai_thi = ? AND NOW() > time_end";
    	   try (PreparedStatement ps = conn.prepareStatement(checkTimeSql)) {
    	        ps.setString(1, typeExam);
    	        try (ResultSet rs = ps.executeQuery()) {
    	            return rs.next(); // Nếu có dữ liệu thì đã quá hạn
    	        }
    	    }
    }
    
    public static boolean insertThiCu(Connection conn, String stuId, String typeExam, String monTC, String monNN) throws SQLException {
        String insertTCsql = "INSERT INTO thi_cu (stu_id, he, mon_tc, mon_nn) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(insertTCsql)) {
            ps.setString(1, stuId);
            ps.setString(2, typeExam);
            ps.setString(3, monTC);
            ps.setString(4, monNN);
            return ps.executeUpdate() > 0;
        }
    }
    
    public static boolean updateThiCu(Connection conn, String idRegister, String monTC, String monNN) throws SQLException {
        String insertTCsql = "UPDATE thi_cu SET mon_tc = ?, mon_nn = ? WHERE id_register = ?";
        try (PreparedStatement ps = conn.prepareStatement(insertTCsql)) {
            ps.setString(1, monTC);
            ps.setString(2, monNN);
            ps.setString(3, idRegister);
            return ps.executeUpdate() > 0;
        }
    }
    
    public static boolean deleteThiCu(Connection conn, String idRegister) throws SQLException {
        String insertTCsql = "DELETE FROM thi_cu WHERE id_register = ?";
        try (PreparedStatement ps = conn.prepareStatement(insertTCsql)) {
            ps.setString(1, idRegister);
            return ps.executeUpdate() > 0;
        }
    }
}
