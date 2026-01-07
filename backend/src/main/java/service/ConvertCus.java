package service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

public class ConvertCus {
	public static String canNullStringSQL(String str) {
		return str == "" ? null : str;
	}
	
	public static byte[] decodeBase64(String base64String) {
	    if (base64String == null || base64String.isEmpty()) {
	        return new byte[0];
	    }

	    // Nếu có dạng "data:image/...;base64,", thì bỏ phần này đi
	    if (base64String.contains(",")) {
	        base64String = base64String.substring(base64String.indexOf(",") + 1);
	    }

	    return Base64.getDecoder().decode(base64String);
	}
	
	public static java.sql.Date convertStringToSqlDate(String dateStr, String format) throws ParseException {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        SimpleDateFormat sdf = new SimpleDateFormat(format);
        sdf.setLenient(false); // tránh parse ngày không hợp lệ như 31/02/2024

        Date utilDate = sdf.parse(dateStr);
        return new java.sql.Date(utilDate.getTime());
    }
}
