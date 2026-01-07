import {useEffect, JSX } from "react";
import {HeaderProps, RowData} from "../../../types/listTable";
import { useInView } from "react-intersection-observer";

import ListTable from "../../ui/components/ListTable";
import "./ListTopNganh.scss";

//dữ liệu test (trong tương lai sẽ có kiểu dữ liệu)
const termsData: RowData[] = [
    { name: "John", age: 5, description: "A short description" },
    { name: "Doe", age: 15, description: "This is a much longer description that exceeds 60 characters" , link: "https://google.com"},
    { name: "Ngô Đình Minh Trang", age: 5, description: "A short description" },
    { name: "John", age: 5, description: "A short description" },
    { name: "John", age: 5, description: "A short description" },
    { name: "John", age: 5, description: "A short description" },
    { name: "John", age: 5, description: "A short description" },
    { name: "John", age: 5, description: "A short description" },
    { name: "John", age: 5, description: "A short description" }
  ]

const headers: HeaderProps = {
    name: "tên",
    age: "tuổi",
    description: "mô tả"
}


const ListTopNganh = (): JSX.Element => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.7,
    });
    
    const items = document.querySelectorAll("tbody tr");
    items.forEach((item) => {
        item.classList.add("hide")
      });

    useEffect(() => {
        if (inView) {
          const startAnimation = () => {
            const items = document.querySelectorAll("tbody tr");
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.remove("hide");
                item.classList.add("start");
              }, index*100);
            });
          };
    
          startAnimation();
        }
      }, [inView]);



    return (
        <section className="list-top-section" ref={ref}>
            <h4>Danh sách các ngành đang được quan tâm</h4>
            <ListTable
                struct={termsData}
                headers={headers}
                isNumbering={true}
                isRanking={true}
            />
        </section>
    );
}

export default ListTopNganh;