import { Select, Space, Tooltip } from "antd";
import { vietnamFlag } from "@admin/asset/countryFlags";
import { useTranslation } from "react-i18next";
import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
// Bạn có thể import thêm các cờ khác nếu có sẵn
import enFlag from "@admin/asset/countryFlags/en.png";
import jaFlag from "@admin/asset/countryFlags/ja.png";
import { UserSwitchOutlined } from "@ant-design/icons";

const languageOptions = [
  {
    value: "lang_vi",
    label: "vietnamese",
    flag: <UserSwitchOutlined />,
    code: "VN",
    tooltip: "Tiếng Việt"
  },
  {
    value: "lang_en",
    label: "english",
    flag: <UserSwitchOutlined />,
    code: "EN",
    tooltip: "English"
  },
  {
    value: "lang_ja",
    label: "japanese",
    flag: <UserSwitchOutlined />,
    code: "JA",
    tooltip: "日本語"
  }
];

function _HeaderLanguageSelect() {
  const { t, i18n } = useTranslation();
  const currentLang = localStorage.getItem("lang") || "lang_vi";

  const handleChange = (value: string) => {
    localStorage.setItem("lang", value);
    i18n.changeLanguage(value.replace("lang_", ""));
    window.location.reload();
  };

  return (
    <div className="header-langue-select">
      <Select
        value={currentLang}
        style={{ width: 100 }}
        onChange={handleChange}
        dropdownMatchSelectWidth={false}
        size="middle"
      >
        {languageOptions.map((lang) => (
          <Select.Option value={lang.value} key={lang.value}>
            <Tooltip title={lang.tooltip}>
              <Space direction="horizontal">
                {/*<img src={lang.flag} alt="flag" style={{ width: 20, marginRight: 4 }} />*/}
                {lang.flag}
                {t(lang.label)}
              </Space>
            </Tooltip>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}

export const HeaderLanguageSelect = WithErrorBoundaryCustom(_HeaderLanguageSelect);
