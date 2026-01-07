import React, { JSX} from 'react';
import MainWrapper from '../../ui/layout/MainWarpper';
import {formatTimestamp} from '../../../function/convert/formatTimestamp';
import './PolicyTerm.scss';

// Định nghĩa kiểu cho dữ liệu terms
interface PolicyDataProps {
  title: string;
  content: string | string[];
}

/**
 * Component cho phép hiển thị phần văn bản dưới dạng Heading Style một cách chuyên nghiệp.
 * Nội dung có thể là chuỗi hoặc danh sách các chuỗi.
 *
 * @param props - Thuộc tính của component.
 * @param props.title - Tiêu đề của điều khoản.
 * @param props.content - Nội dung điều khoản (chuỗi hoặc danh sách).
 * @returns Phần tử React hiển thị điều khoản.
 */
const FormatHeadingStyle = ({ title = "", content = "" }: PolicyDataProps) => {
  const renderListItems = (items: string[], keyPrefix: string): JSX.Element => (
    <ul key={keyPrefix}>
        {items.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
    </ul>
);

  // Hàm chính để render nội dung
  const renderContent = () => {
      if (!Array.isArray(content)) {
          return <p>{content}</p>;
      }

      const elements: React.ReactElement[] = [];
      let listItems: string[] = [];

      content.forEach((item, index) => {
          const trimmed = item.trim();
          if (trimmed.startsWith('-')) {
              listItems.push(trimmed.replace(/^-/, '').trim());
          } else {
              if (listItems.length > 0) {
                  elements.push(renderListItems(listItems, `list-${index}`));
                  listItems = [];
              }
              elements.push(
                  <p key={`text-${index}`} dangerouslySetInnerHTML={{ __html: trimmed }} />
              );
          }
      });

      // Render phần còn lại nếu kết thúc bằng danh sách
      if (listItems.length > 0) {
          elements.push(renderListItems(listItems, 'list-end'));
      }

      return elements;
  };

  return (
      <section className="term">
          <h4>{title}</h4>
          {renderContent()}
      </section>
  );
}

// Dữ liệu terms
const termsData: PolicyDataProps[] = [
  {
      title: "Chấp Nhận Điều Khoản",
      content: "Bằng cách truy cập hoặc sử dụng Website, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều Khoản này, cùng với các chính sách liên quan (như Chính Sách Bảo Mật). Nếu bạn không đồng ý, vui lòng không sử dụng Website."
  },
  {
      title: "Đối Tượng Sử Dụng",
      content: [
          "- Website dành cho các cá nhân, tổ chức tham gia quá trình đăng ký tuyển sinh, bao gồm học sinh, phụ huynh, hoặc đại diện hợp pháp.",
          "- Người dùng phải từ 16 tuổi trở lên hoặc có sự đồng ý của phụ huynh/người giám hộ hợp pháp nếu dưới 16 tuổi.",
          "- Bạn chịu trách nhiệm đảm bảo rằng thông tin cung cấp là chính xác, đầy đủ và cập nhật."
      ]
  },
  {
      title: "Dịch Vụ Cung Cấp",
      content: [
          "Website cung cấp các dịch vụ sau:",
          "- Đăng ký hồ sơ tuyển sinh trực tuyến.",
          "- Cung cấp thông tin về các chương trình học, kỳ thi, và yêu cầu tuyển sinh.",
          "- Hỗ trợ tư vấn và giải đáp thắc mắc liên quan đến quy trình tuyển sinh.",
          "Chúng tôi có quyền thay đổi, tạm ngừng hoặc chấm dứt bất kỳ dịch vụ nào mà không cần thông báo trước."
      ]
  },
  {
      title: "Quyền và Nghĩa Vụ của Người Dụng",
      content: [
          "<strong>Quyền</strong>:",
          "- Truy cập và sử dụng các tính năng của Website theo đúng mục đích tuyển sinh.",
          "- Nhận thông tin và hỗ trợ từ đội ngũ quản trị Website.",
          "<strong>Nghĩa vụ</strong>:",
          "- Không sử dụng Website cho các mục đích bất hợp pháp, gian lận, hoặc gây hại cho người khác.",
          "- Không sao chép, chỉnh sửa, hoặc phát tán nội dung của Website mà không có sự cho phép.",
          "- Không tấn công, làm gián đoạn hoặc xâm phạm hệ thống bảo mật của Website."
      ]
  },
  {
      title: "Quyền Sở Hữu Trí Tuệ",
      content: [
          "- Mọi nội dung trên Website (văn bản, hình ảnh, logo, thiết kế, v.v.) đều thuộc sở hữu của chúng tôi hoặc được cấp phép sử dụng hợp pháp.",
          "- Người dùng không được sao chép, phân phối, hoặc sử dụng nội dung cho mục đích thương mại mà không có sự đồng ý bằng văn bản từ chúng tôi."
      ]
  },
  {
      title: "Bảo Mật và Dữ Liệu Cá Nhân",
      content: [
          "- Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính Sách Bảo Mật của Website.",
          "- Bạn đồng ý cung cấp thông tin chính xác và chịu trách nhiệm bảo mật tài khoản của mình (tên đăng nhập, mật khẩu).",
          "- Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào do bạn để lộ thông tin tài khoản."
      ]
  },
  {
      title: "Giới Hạn Trách Nhiệm",
      content: [
          "- Website được cung cấp trên cơ sở \"như hiện tại\" và chúng tôi không đảm bảo rằng Website sẽ không bị gián đoạn hoặc không có lỗi.",
          "- Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, hoặc ngẫu nhiên phát sinh từ việc sử dụng Website, trừ khi có quy định khác của pháp luật."
      ]
  },
  {
      title: "Chấm Dứt Sử Dụng",
      content: [
          "- Chúng tôi có quyền tạm khóa hoặc chấm dứt quyền truy cập của bạn vào Website nếu bạn vi phạm Điều Khoản này hoặc có hành vi gây hại đến hệ thống hoặc người dùng khác.",
          "- Bạn có thể ngừng sử dụng Website bất kỳ lúc nào."
      ]
  },
  {
      title: "Thay Đổi Điều Khoản",
      content: [
          "- Chúng tôi có quyền cập nhật hoặc sửa đổi Điều Khoản này bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên Website.",
          "- Việc tiếp tục sử dụng Website sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các Điều Khoản mới."
      ]
  },
  {
      title: "Luật Áp Dụng và Giải Quyết Tranh Chấp",
      content: [
          "- Các Điều Khoản này được điều chỉnh bởi pháp luật Việt Nam.",
          "- Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam."
      ]
  },
  {
      title: "Liên Hệ",
      content: [
          "Nếu bạn có thắc mắc về Điều Khoản này, vui lòng liên hệ:",
          "- Email: support@tuyensinhwebsite.com",
          "- Hotline: [Số điện thoại hỗ trợ]",
          "- Địa chỉ: [Địa chỉ cơ quan quản lý Website]"
      ]
  }
];

// Giả định dữ liệu từ database (timestamp dạng ISO string)
const LAST_UPDATED = formatTimestamp('2025-05-03T00:00:00Z'); // Kết quả: "03/05/2025"

/**
 * Component PolicyTerm hiển thị trang điều khoản sử dụng của Website.
 */
const PolicyTerm = (): JSX.Element => {
  return (
    <div className="policy-term-background">
      <MainWrapper>
        <div className="policy-term">
          <h1>Điều khoản sử dụng</h1>
          <p id="last-update">Cập nhật lần cuối: {LAST_UPDATED}</p>
          <p>
            Chào mừng bạn đến với trang tuyển sinh của chúng tôi ("Website"). Khi sử dụng Website, bạn đồng ý tuân thủ các
            Điều Khoản Dịch Vụ ("Điều Khoản") dưới đây. Vui lòng đọc kỹ trước khi sử dụng.
          </p>
          <div className="terms-list">
            {termsData.map((term) => (
              <FormatHeadingStyle key={term.title} title={term.title} content={term.content} />
            ))}
          </div>
          <p>
            <i>Cảm ơn bạn đã sử dụng Website của chúng tôi. Chúng tôi hy vọng bạn sẽ có một trải nghiệm tuyệt vời!</i>
          </p>
        </div>
      </MainWrapper>
    </div>
  );
};

export default PolicyTerm;