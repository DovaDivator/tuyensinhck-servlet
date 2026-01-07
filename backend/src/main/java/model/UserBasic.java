package model;

public class UserBasic {
	String id;
    String name;
    int role;
    byte[] avatar;
    
    public UserBasic() {}
    
	public static final UserBasic NULL = new UserBasic(null, null, -1, null) {
		@Override
		public boolean isNull() {
			return true;
		}
	};

	public UserBasic(String id, String name, int role, byte[] avatar) {
		this.id = id;
		this.name = name;
		this.role = role; 
		this.avatar = avatar;
	}

	public byte[] getAvatar() {
		return avatar;
	}

	public void setAvatar(byte[] avatar) {
		this.avatar = avatar;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}
    
    public boolean isAdmin() {
		return this.role == 151; // Giả sử 1 là mã cho admin
	}
    
    public boolean isStudent() {
    	return this.role == 1; 
    }
    
    public boolean isTeacher() {
		return this.role == 2; 
	}
	
	public boolean isNull() {
		return false;
	}
	
	@Override
	public String toString() {
		return "UserBasic [id=" + id + ", name=" + name + ", role=" + role + "]";
	}
}

