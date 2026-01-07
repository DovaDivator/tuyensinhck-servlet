package service;

import java.io.BufferedReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

public class HttpJson {
	public static String convertStringToJson(String str) {
	    if (str == null) return "";
	    return str.replace("\\", "\\\\")
	              .replace("\"", "\\\"")
	              .replace("\n", "\\n")
	              .replace("\r", "\\r")
	              .replace("\t", "\\t");
	}
	
	public static String readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        String line;
        BufferedReader reader = request.getReader();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return sb.toString();
    }
	
	public static String convertTime(Date time, String format) {
		if (time == null) return null;
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		return sdf.format(time);
	}
	
	public static int getTotalPage(int total, int limit) {
		int pageCount = (int) Math.ceil((double) total / limit);
		if (pageCount == 0) pageCount = 1;
		return pageCount;
		
	}
	
	  public static String convertToBase64(byte[] bytes) {
	        if (bytes == null) {
	            return "";
	        }
	        return Base64.getEncoder().encodeToString(bytes);
	    }
}
