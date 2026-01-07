import { useState, useEffect, useRef } from 'react';
import Dropdown from '../ui/input/Dropdown';
import { FormDataProps } from '../../types/FormInterfaces';
import { getListMonChoice } from '../../api/GetMonHoc';

const EditStuExamForm = ({ setFormData, defaultValue = {monTC: "", monNN: ""}, setIsNotChange}: {
  setFormData?: (data: { [key:string]: string }) => void;
  defaultValue? : FormDataProps;
  setIsNotChange: (value: boolean) => void;
}) => {
  // console.log(setIsNotChange);
  const [selectedCountry, setSelectedCountry] = useState<FormDataProps>({monTC: "", monNN: ""});
  const [dataMon, setDataMon] = useState({
        monTC: [],
        monNN: []
    })
    setIsNotChange(true);

    const mapLabelToValue = (label: string, list: { value: string; label: string }[]) => {
      return list.find(item => item.label === label)?.value || "";
    };

  const defaultMon = useRef<FormDataProps>({monTC: "", monNN: ""});

  useEffect(() =>{
    const getDataMon = async () => {
                try{
                    const result = await getListMonChoice();;
                    console.log(result)
                    if(!result.data) throw new Error("Không có dữ liệu");
                    setDataMon(result.data);
                    defaultMon.current = {
                      monTC: mapLabelToValue(String(defaultValue.monTC), result.data.monTC),
                      monNN: mapLabelToValue(String(defaultValue.monNN), result.data.monNN)
                    };
                    setSelectedCountry(defaultMon.current);
                }catch(error: any){
                    console.error(error);
                }
            }
    
            getDataMon();
  },[]);

  // Cập nhật formData mỗi khi selectedCountry thay đổi
    useEffect(() => {
      if (setFormData) {
        setFormData({
          monTC: String(selectedCountry.monTC || ""),
          monNN: String(selectedCountry.monNN || ""),
        });
        setIsNotChange(
            selectedCountry.monTC === defaultMon.current.monTC &&
            selectedCountry.monNN === defaultMon.current.monNN
        ); 
      } else {
        console.warn("setFormData không được truyền vào");
      }
    }, [selectedCountry, setFormData, defaultMon]);

  return (
    <div style={{ height: '270px' }}>
      <label style={{ marginBottom: '6px', display: 'block' }}>Chọn môn học quản lý:</label>
      <Dropdown
        name="monTC"
        id="monTC"
        label="môn tự chọn"
        value={String(selectedCountry.monTC)}
        setFormData={setSelectedCountry}
        choices={dataMon.monTC}
      />
      <Dropdown
        name="monNN"
        id="monNN"
        label="môn ngoại ngữ"
        value={String(selectedCountry.monNN)}
        setFormData={setSelectedCountry}
        choices={dataMon.monNN}
      />
    </div>
  );
};

export default EditStuExamForm;
