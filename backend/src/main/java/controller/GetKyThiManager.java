package controller;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import dao.KyThiManagerDAO;
import util.DBConnectionMain;

/**
 * Servlet implementation class GetKyThiManager
 */
@WebServlet("/get-ky-thi")
public class GetKyThiManager extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetKyThiManager() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		JSONObject jsonResponse = new JSONObject();
		DBConnectionMain dbConn = null;
		Connection conn = null;

		try {
			
			String type = request.getParameter("type") != null ? request.getParameter("type") : "";
		    dbConn = new DBConnectionMain();
			conn = dbConn.getConnection();

			
			switch (type) {
			case "list":{				
				JSONArray listType = KyThiManagerDAO.listKyThi(conn);
				jsonResponse.put("data", listType);
				break;
			}
			default:{
				JSONArray result = KyThiManagerDAO.getKyThi(conn, type);
				jsonResponse.put("data", result);
				break;
				}
		    }

			jsonResponse.put("success", true);
			jsonResponse.put("message", "Lấy dữ liệu thành công!");

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			jsonResponse.put("success", false);
			jsonResponse.put("message", e.getMessage());
		}finally {
			if (conn != null) {
		        try {
		            conn.close();
		        } catch (Exception e) {
		            System.err.println("Không thể đóng kết nối: " + e.getMessage());
		        }
		    }
		}

		response.getWriter().write(jsonResponse.toString());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

}
