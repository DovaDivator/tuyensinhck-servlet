package controller;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import dao.RegisterDAO;
import service.ConvertCus;
import service.HttpJson;
import util.DBConnectionMain;

/**
 * Servlet implementation class RegisterApi
 */
@WebServlet("/register")
public class RegisterApi extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterApi() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: register").append(request.getContextPath());
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject jsonResponse = new JSONObject();
		DBConnectionMain dbConn = null;
		Connection conn = null;
	    try {
	        String body = HttpJson.readRequestBody(request);
	        JSONObject json = new JSONObject(body);

	        String name = json.getString("name");
	        String email = json.getString("email");
	        String phone = ConvertCus.canNullStringSQL(json.getString("phone"));
	        String password = json.getString("password");

	        response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
	        
	        dbConn = new DBConnectionMain();
			conn = dbConn.getConnection();
			
			boolean success = RegisterDAO.processRegister(conn, name, email, phone, password);
			if (!success) {
				throw new Error("Cập nhật không thành công! Dữ liệu có thể bị trùng");
			}
			jsonResponse.put("success", true);
			jsonResponse.put("message", "Cập nhật thành công!");

	    } catch (Exception e) {
	        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			jsonResponse.put("success", false);
			jsonResponse.put("message", e.getMessage());
	    }
	    finally {
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

}
