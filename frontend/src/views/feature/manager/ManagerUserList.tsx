import React,{JSX, useState, useEffect} from 'react';
import { parsePath, useLocation, useSearchParams} from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';

import { jsxEleProps } from '../../../types/jsxElementInterfaces';
import './ManagerUserList.scss';
import ListTable from '../../ui/components/ListTable';
import InputField from '../../ui/input/InputField';
import { FormDataProps} from '../../../types/FormInterfaces';
import InputChoice from '../../ui/input/InputChoice';
import { ChoiceGroup } from '../../../classes/ChoiceGroup';
import Button from '../../ui/input/Button';
import Pagination from '../../ui/components/Pagination';
import Dropdown from '../../ui/input/Dropdown';
import { useAppContext } from '../../../context/AppContext';
import { fetchUsers, fetchUsersPagination, fetchUsersDropdownItems} from '../../../api/fetchUser';
import * as editFunc from '../../../function/convert/AdminDataConvertEdit';

const CLASS_PAGES = ['giao-vien', 'thi-sinh', 'tai-khoan'];

const HEADERS_CASE:
{
  [key: string]: {
    [field: string]: string;
  };
} = {
  "thi-sinh": {exam_id: "SBD", stu_id: "Mã TS", name: "Họ tên", he: "Cấp bậc", khoa_thi: "Khóa", phong1: "Phòng thi 1", phong2: "Phòng thi 2", mon_tc: "Môn tự chọn", phong3: "Phòng thi 3", mon_nn: "Ngoại ngữ", phong4: "Phòng thi 4"},
  "tai-khoan": { id: "Mã TS", name: "Họ tên", created_at: "Thời gian đăng ký", isFreeze: "Trạng thái", isxacthuc: "Đã xác thực"},
  "giao-vien": {id: "Mã GV", name: "Họ tên", mon_ql: "Môn quản lý", isFreeze: "Trạng thái"}
};

const HEADERS_EDIT_CASE:
{
  [key: string]: {
    [field: string]: string;
  };
} = {
  "thi-sinh": {del: "Xóa"},
  "tai-khoan": {removeCd: "Loại bỏ CCCD", freeze: "Đình chỉ"},
  "giao-vien": {change: "Chỉnh sửa môn", freeze: "Đình chỉ"}
};

interface ManagerUserListProps extends jsxEleProps{
  name?: string;
}

const ManagerUserList = ({className = "", name = ""}: ManagerUserListProps): JSX.Element =>{
    const {token} = useAuth();
    const location = useLocation();
    const path = location.pathname;
    const pathParts = path.split('/'); // ["", "quan-ly", "giao-vien"]

    const [searchParams] = useSearchParams();
    const pageNum = parseInt(searchParams.get("page") || "1");
    const searchUrl = (searchParams.get("search") || "").slice(0, 70);
    const filtersUrl: Record<string, string> = {};
    const [isEdit, setIsEdit] = useState<boolean>(false);

    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "search") {
        filtersUrl[key] = value;
      }
    });

    if (pathParts.length === 2) return NullJsxError(`path không hợp lệ ${path}`);
    if (!CLASS_PAGES.includes(pathParts[2])) return NullJsxError(`type path không xác định ${pathParts[2]}`);

  const [formData, setFormData] = useState<FormDataProps>(() => {
    const base: FormDataProps = {
      search: searchUrl || ''
    };

    switch (pathParts[2]) {
      case CLASS_PAGES[1]:
        base.he = filtersUrl["he"] ?? '';
        base.khoa = filtersUrl["khoa"] ?? '0';
        base.tuChon = filtersUrl["tuChon"] ?? '';
        base.ngoaiNgu = filtersUrl["ngoaiNgu"] ?? '';
        break;
      case CLASS_PAGES[2]:
        base.xacThuc = filtersUrl["xacThuc"] ?? '';
        base.hoatDong = filtersUrl["hoatDong"] ?? '';
        break;
      case CLASS_PAGES[0]:
        base.mon = filtersUrl["mon"] ?? '';
        base.hoatDong = filtersUrl["hoatDong"] ?? '';
        break;
    }

    return base;
  });
   

    const [data, setData] = useState<any>([]);
    
    const choices_he = [
  { value: '1', label: 'Đại học' },
  { value: '2', label: 'Cao đẳng' },
  { value: '3', label: 'Liên thông' },
];

    const checkboxFilterTK = {
      filterStatus: new ChoiceGroup([
        {
          value: 'true',
          label: 'Đã xác thực'
        },
        {
          value: 'false',
          label: 'Chưa xác thực'
        },
      ]),
      filterFreeze: new ChoiceGroup([
        {
          value: 'true',
          label: 'Đang hoạt động'
        },
        {
          value: 'false',
          label: 'Bị đình chỉ'
        },
      ])
    }

    const [error, setError] = useState("");
    const {setIsLoading} = useAppContext();
    useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError("");

      let params = {};

      switch (pathParts[2]) {
        case CLASS_PAGES[1]:
          params = {
            he: formData.he,
            khoa: formData.khoa,
            tuChon: formData.tuChon,
            ngoaiNgu: formData.ngoaiNgu
          };
          break;
        case CLASS_PAGES[2]:
          params = {
            xacThuc: formData.xacThuc,
            hoatDong: formData.hoatDong
          };
          break;
        case CLASS_PAGES[0]:
          params = {
            mon: formData.mon,
            hoatDong: formData.hoatDong
          };
          break;
      }

          try {
            const users = await fetchUsers({
              token: token,
              type: pathParts[2],
              search: String(formData.search),
              params,
              page: pageNum
            });

            console.log(users);
            
            setData(
              users.data.map((user: any) => ({
                ...user,
                isFreeze: user.isFreeze === true ? "Tạm đình chỉ" : "Đang hoạt động",
                isxacthuc: 
                  user.isxacthuc === 0
                  ? "Chờ phê duyệt"
                  : user.isxacthuc === 1
                  ? "Đã xác thực"
                  : user.isxacthuc === -1
                  ? "Đang từ chối"
                  : "Chưa xác thực",
              }))
            );
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        };

        getData();
      }, [pageNum]);

  const [totalPage, setTotalPage] = useState<number>(1);
  useEffect(() => {
    const getPagination = async () => {
      try {
        const users = await fetchUsersPagination({
          token: token,
          type: pathParts[2],
          search: String(formData.search),
          params:{
            xacThuc: formData.xacThuc,
            hoatDong: formData.hoatDong
          },
          page: pageNum
        });
        setTotalPage(users.data.totalPage);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getPagination();
  }, [pageNum]);

    const [monTuChon, setMonTuChon] = useState<any>([]);
    useEffect(() => {
    const getMonTuChon = async () => {
      try {
        const users = await fetchUsersDropdownItems({
          token: token,
          type: "tu-chon"
        });
        setMonTuChon(users.data);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error(err);
      }
      console.log(monTuChon);
    };

    if(formData.tuChon !== undefined) getMonTuChon();
  }, [formData.tuChon !== undefined]);

      const [monNgoaiNgu, setMonNgoaiNgu] = useState<any>([]);
    useEffect(() => {
    const getMonTuChon = async () => {
      try {
        const users = await fetchUsersDropdownItems({
          token: token,
          type: "ngoai-ngu"
        });
        setMonNgoaiNgu(users.data);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error(err);
      }
    };

    if(formData.tuChon !== undefined) getMonTuChon();
  }, [formData.tuChon !== undefined]);

     const [mon, setMon] = useState<{ value: string; label: string }[]>([]);
    useEffect(() => {
    const getMon = async () => {
      try {
        const users = await fetchUsersDropdownItems({
          token: token,
          type: "mon-hoc"
        });
        setMon(users.data);
      } catch (err) {
        console.error(err);
      }
    };

    if(formData.mon !== undefined) getMon();
  }, [formData.mon !== undefined]);

  useEffect(() => {
    switch (pathParts[2]) {
      case CLASS_PAGES[1]:
        if(isEdit){
          editFunc.EditThiSinh({token, data, setData, setIsEdit});
        }else{
          editFunc.DefaultThiSinh({data, setData});
        }
        break;
      case CLASS_PAGES[2]:
        if(isEdit){
          editFunc.EditTaiKhoan({token, data, setData, setIsEdit});
        }else{
          editFunc.DefaultTaiKhoan({data, setData});
        }
        break;
      case CLASS_PAGES[0]:
        if(isEdit){
          editFunc.EditGiaoVien({token, data, setData, setIsEdit, listMon: mon});
        }else{
          editFunc.DefaultGiaoVien({data, setData});
        }
        break;
    }
  }, [isEdit])

    return (
        <section className={`manager-user-list ${className}`}>
            <h2>Danh sách {name}</h2>
            <div className='manager-user-list__filter'>
              <form
                id="filter-user-form"
                noValidate
              >
                <InputField
                  name="search"
                  id="search"
                  placeholder='Tìm kiếm'
                  value={formData.search}
                  maxLength={70}
                  formData={formData}
                  setFormData={setFormData}
                />
                {pathParts[2] === CLASS_PAGES[2] && (<>
                <InputChoice
                  name="xacThuc"
                  id="xacThuc"
                  type="radio"
                  label='Trạng thái xác thực CCCD'
                  choices={checkboxFilterTK.filterStatus.getOptions()}
                  value={formData.xacThuc}
                  setFormData={setFormData}
                  columns={2}
                />
                <InputChoice
                  name="hoatDong"
                  id="hoatDong"
                  type="radio"
                  label='Tình trạng tài khoản'
                  choices={checkboxFilterTK.filterFreeze.getOptions()}
                  value={formData.hoatDong}
                  setFormData={setFormData}
                  columns={2}
                />
                </>)}

                {pathParts[2] === CLASS_PAGES[0] && (<>
                <InputChoice
                  name="hoatDong"
                  id="hoatDong"
                  type="radio"
                  label='Tình trạng tài khoản'
                  choices={checkboxFilterTK.filterFreeze.getOptions()}
                  value={formData.hoatDong}
                  setFormData={setFormData}
                  columns={2}
                />
                <Dropdown
                    name="mon"
                    id="mon"
                    label='Môn quản lý'
                    choices={mon}
                    value={String(formData.mon)}
                    setFormData={setFormData}
                    allowDefault={true}
                  />
                </>)}

                {pathParts[2] === CLASS_PAGES[1] && (<>
                <div className='horizontal-field'>
                  <Dropdown
                    name="he"
                    id="he"
                    label='Hệ đào tạo'
                    choices={choices_he}
                    value={String(formData.he)}
                    setFormData={setFormData}
                  />
                  <InputField
                    name="khoa"
                    id="khoa"
                    type="number"
                    value={formData.khoa}
                    formData={formData}
                    setFormData={setFormData}
                    placeholder='Khóa thi'
                  />
                </div>
                <div className='horizontal-field'>
                  <Dropdown
                    name="tuChon"
                    id="tuChon"
                    label='Môn tự chọn'
                    choices={monTuChon}
                    value={String(formData.tuChon)}
                    setFormData={setFormData}
                    allowDefault={true}
                  />
                  <Dropdown
                    name="ngoaiNgu"
                    id="ngoaiNgu"
                    label='Môn ngoại ngữ'
                    choices={monNgoaiNgu}
                    value={String(formData.ngoaiNgu)}
                    setFormData={setFormData}
                    allowDefault={true}
                  />
                </div>
                </>)}

                <div className='button-container'>
                  <Button
                    type="submit"
                    text="Tìm kiếm"
                    className='btn-confirm'
                  />
                  <Button
                    type="button"
                    text="Đặt lại"
                    className='btn-cancel'
                    onClick={() => {
                      setFormData({ search: "", xacThuc: [], hoatDong: [], kyThi: "" });
                    }}
                  />
                  <Button
                    type="button"
                    text={isEdit ? "Chế độ xem" : "Chỉnh sửa"}
                    onClick={() => {
                      setIsEdit(!isEdit);
                    }}
                  />
                  {pathParts[2] === CLASS_PAGES[0] &&
                  <Button
                    type="button"
                    title={"Thêm giáo viên"}
                    icon={"fa-solid fa-plus"}
                    onClick={() => {
                       editFunc.addGV(token, mon)
                    }}
                    className='btn-confirm'
                  />
                  }
                </div>
              </form>
              <hr/>
            </div>
            <ListTable
              struct = {data}
              headers={
                isEdit ?
                {...HEADERS_CASE[pathParts[2]], ...HEADERS_EDIT_CASE[pathParts[2]]} :
                HEADERS_CASE[pathParts[2]]
              }
              error={error}
            />
            <Pagination
              curNum={pageNum}
              listLength={totalPage}
            />
        </section>
    );
}

export default React.memo(ManagerUserList);

const NullJsxError = (error:string):JSX.Element => {
  console.log(error);
  return<></>;
}
