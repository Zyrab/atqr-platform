export const generator = {
  title: "შეგიძლიათ შექმნათ და ჩამოტვირთოთ უფასოდ. შენახვას სჭირდება ანგარიში.",
  inputs: {
    url: { text: "URL ბმული", placeholder: "https://example.com" },
    name: { text: "QR სახელი (არასავალდებულო)", placeholder: "გამოიყენება მხოლოდ შენახვის შემთხვევაში" },
    text: { text: "ტექსტი", placeholder: "შეიყვანეთ ტექსტი აქ" },
    ssid: { text: "Wi-Fi სახელი (SSID)", placeholder: "ქსელის სახელი" },
    password: {text: "Wi-Fi პაროლი", placeholder: "პაროლი" },
    hidden: { text:"დაფარული ქსელი"}
  },
    editor_panel:[
    {
      id: "content",
      title: "დაამატე კონტენტი",
      icon: "edit",
      comp:"input-area"
    },
    {
      id: "shapes",
      title: "შეარჩიე ფორმები",
      icon: "qr_code",
      comp:"shapes-designer"
    },
    {
      id: "colors",
      title: "შეცვალე ფერები",
      icon: "palette",
      comp:"colors-designer"
    },
    {
      id: "logo-area",
      title: "დაამატო ლოგო",
      icon: "image",
      comp:"upload-logo"
    },
  ],

  qr_types:["url","text","wifi"],
  designer: {
    body_p: "ფორმის შაბლონი",
    body_c: "ფორმის ფერი",
    eye_f: "თვალის ჩარჩო",
    eye_b: "თვალის გუგა",
    eye_c: "თვალის ფერი",
    bg_c: "ფონის ფერი",
  },
  logo: { title: "ლოგო", upload: "ლოგოს ატვირთვა", change: "ლოგოს შეცვლა", icon: "upload", note: "მაქს. 2MB. სასურველია გამჭვირვალე PNG.", rmv_bg: "ფონის მოცილება" },
  download: { title: "ჩამოტვირთვა", icon: "download", note: "უფასო სტატიკური QR • ვადის გარეშე" },
  save: { title: "დაფაზე შენახვა", icon: "save", note: "გსურთ ამ კოდის შენახვა ან სხვების მართვა?", limit_reached:"უფასო გეგმაზე ლიმიტი მიღწეულია (10 QR კოდი)." },
  signin: { title: "შესვლა შესანახად", icon: "save", note: "გაიარეთ ავტორიზაცია 10-მდე კოდის შესანახად" },
  footer: "QR კოდებს ხშირად აარეკლამებენ როგორც „უფასოს“, თუმცა დროთა განმავლობაში ისინი ითიშება. ეს გენერატორი ქმნის სტატიკურ QR კოდებს, რომლებსაც ვადა არასდროს გასდით. იდეალურია ბეჭდური მასალებისთვის: პოსტერები, მენიუები, შეფუთვა და სავიზიტო ბარათები."
}