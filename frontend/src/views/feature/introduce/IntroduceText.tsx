import {JSX} from "react";

const IntroduceText = (): JSX.Element => {
    return (
        <article className="introduce-text">
            <h2 className="introduce-text__title">Giới thiệu</h2>
            <p>
                Trường Đại học squareSchool là một cơ sở giáo dục hiện đại, 
                năng động và tiên phong trong việc đào tạo thế hệ sinh viên chất lượng cao, 
                đáp ứng nhu cầu của thời đại số. 
                Với sứ mệnh "Kiến tạo tri thức – Dẫn lối tương lai", 
                SquareSchool không ngừng đổi mới chương trình giảng dạy, 
                áp dụng các phương pháp học tập tiên tiến và kết hợp chặt chẽ giữa lý thuyết với thực tiễn.
            </p>

            <p>
                Tọa lạc tại trung tâm của một thành phố phát triển, 
                SquareSchool sở hữu hệ thống cơ sở vật chất hiện đại, 
                môi trường học tập thân thiện cùng đội ngũ giảng viên tâm huyết, 
                trình độ chuyên môn cao. Trường cung cấp đa dạng các ngành học từ 
                Công nghệ thông tin, Kinh doanh, Thiết kế sáng tạo cho đến Truyền thông và Khoa học dữ liệu, 
                phù hợp với xu hướng toàn cầu và nhu cầu tuyển dụng thực tế.
            </p>

            <p>
                Không chỉ chú trọng đến học thuật, squareSchool còn đặc biệt quan tâm đến việc phát triển 
                kỹ năng mềm, tư duy phản biện và tinh thần khởi nghiệp cho sinh viên thông qua các hoạt động ngoại khóa, 
                dự án cộng đồng và chương trình hợp tác quốc tế.
            </p>

            <p>
                Với phương châm "Học để làm, học để phát triển bản thân, 
                học để hội nhập", squareSchool là lựa chọn lý tưởng dành cho những ai mong muốn một nền giáo dục toàn diện, 
                thực tiễn và có tầm nhìn quốc tế.
            </p>
        </article>
    );
};

export default IntroduceText;