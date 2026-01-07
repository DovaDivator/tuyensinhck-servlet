import { canNullUI } from "../function/convert/canNullUI";

export class BasicUserTitle {
  id: string;
  name: string;
  role: number;
  avatarImg: string;

  constructor(id: string, name: string, role: number, avatarImg: string) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.avatarImg = avatarImg;
  }

  isAdmin(): boolean {
    return this.role === 151;
  }

  isTeacher(): boolean {
    return this.role === 2;
  }

  isStudent(): boolean {
    return this.role === 1;
  }

  isGuest(): boolean {
    return !this.isAdmin() && !this.isStudent() && !this.isTeacher();
  }

  getRoleName(): string {
    if (this.isAdmin()) return "Quản trị viên";
    if (this.isTeacher()) return "Giáo viên";
    if (this.isStudent()) return "Thí sinh";
    return "Không xác định";
  }

  getImage(): string {
    return this.avatarImg === "" ? "https://data.designervn.net/2020/10/12608_8040b633df346bd3f1379ddb90490a64.png" : this.avatarImg;
  }
}

export class BasicUserInfo extends BasicUserTitle {
  email: string;
  phone: string;
  created_at: any;

  constructor(
    id: string,
    name: string,
    role: number,
    avatarImg: string,
    email: string,
    phone: string,
    created_at: string
  ) {
    super(id, name, role, avatarImg);
    this.email = email;
    this.phone = phone;
    this.created_at = this.parseDate(created_at); // chuyển string sang Date
  }

  private parseDate(dateString: any): Date {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  getDateString(): String {
    const pad = (n: number): string => n < 10 ? '0' + n : n.toString();
    const hours = pad(this.created_at.getHours());
    const minutes = pad(this.created_at.getMinutes());
    const day = pad(this.created_at.getDate());
    const month = pad(this.created_at.getMonth() + 1);
    const year = this.created_at.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
}

