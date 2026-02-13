export const landing = {
  title:{
    title:"Free QR Code Generator, No Login, No Expiration",
    subtitle:"Generate static QR codes for URLs instantly. Download, print, and use them forever."
  },
  whatIsQr: {
    title: "What Is a QR Code?",
    subtitle: [
      "A QR code is a type of barcode that opens a link when scanned with a phone camera.  It's commonly used to share websites, videos, menus, forms, and contact pages. especially on printed materials.",
      "Unlike short links, QR codes work instantly and don't require typing.",
    ],
    img:"scanning-qr"
  },
  staticVsDynamic: {
    title: "Static vs Dynamic QR Codes",
    content:[
      {
        title:"Static QR Codes (Free)",
        items:["The link is embedded directly in the QR code","Never expire","Work offline after creation","Best for printing"],
        footer:"This is what you generate for free on this page."
      },
      {
        title:"Dynamic QR Codes (Paid)",
        items:["The QR code points to a redirect","The destination can be changed later","Requires a server to stay active","Useful for campaigns and tracking"],
        footer:"Useful when you need to change links after printing."
      },
    ],
    footer:
      "Many “free” QR generators use dynamic QR codes by default, which stop working unless you pay. This tool gives you static QR codes upfront, with no hidden expiration.",
  },
  unsure: {
    title: "Not sure which one you need?",
    subtitle: "Start with a free static QR code, upgrade only if you need more control.",
    button:{ label: "Generate a free QR code", action:"scroll_to_generator" }
  },
  examples:{
    title:"High-Quality QR Codes You Can Customize",
    subtitle:"A QR code should scan instantly and still look good when printed. Customize colors, shapes, and logos without breaking readability.",
    notice:"All examples are static QR codes with no expiration.",
    content:[
      {title:"Custom shapes",subtitle:"Start with a free static QR code, upgrade only if you need more control.",img:"custum-shapes"},
      {title:"Brand colors",subtitle:"Match your brand while keeping strong contrast for reliable scanning.",img:"custumize-colors"},
      {title:"Logo support",subtitle:"Add your logo in the center, optional background removal included.",img:"logo-support"},
      {title:"Print-ready output",subtitle:"Sharp, high-resolution QR codes suitable for print and digital use.",img:"high-quality-export"},
    ],
    footer:"The generator prevents combinations that reduce scannability."
  },
  pricing:{
    title:"Free and Paid. What’s Included",
    subtitle:"You can generate and download static QR codes for free. Create an account only if you want to save or manage them.",
    content:[
      {
        title:"Free (No account required)",
        items:["Generate unlimited static QR codes","Download instantly","No expiration","No tracking","Not saved on the server"],
        button: { label: "Generate free QR code", action: "scroll_to_generator"  },      
      },
      {
        title:"Free account",
        items:["Save up to 10 static QR codes","Access them from any device","Edit design (URL stays the same)"],
        button:{ label: "Create free account", action:"go_to_login" }
      },
      {
        title:"From $3 / month",
        items:["Change destination link anytime","Central management dashboard","Designed for campaigns and updates","Requires an active plan"],
        button:{label: "Get dynamic QR codes", action:"go_to_pricing"}
      }
    ],
    footer:"Static QR codes are best for most printed use cases. Dynamic QR codes are only needed when the destination must change after printing."
  },
  usefullness:{
    title:"When Are Dynamic QR Codes Useful?",
    content:[
      {title:"Update Menus Instantly",text:"Updating a restaurant menu without reprinting",icon:"utensils",color:"#E6D839"},
      {title:"Modify campaing link",text:"Changing a campaign link after launch",icon:"unlink",color:"#E42929"},
      {title:"Time-Limited Redirects",text:"Redirecting users during limited-time promotions",icon:"discount",color:"#1C8D00"},
      {title:"Multi-Location managment",text:"Managing multiple locations from one QR code",icon:"alt_location",color:"#2288C7"},
    ],
    note:"If none of these apply, a free static QR code is usually enough."
  },
  faq:{
    title:"Frequently Asked Questions",
    content:[
      {
        question:"Are the free QR codes really free?",
        answer:"Yes. Static QR codes generated here are free to create, download, and use. They do not expire."
      },
      {
        question:"Do I need an account to generate a QR code?",
        answer:"No. You can generate and download static QR codes without signing in. An account is only needed to save and manage them."
      },
      {
        question:"Will my QR code stop working later?",
        answer:"Static QR codes will continue to work as long as the destination URL exists."
      },
      {
        question:"What’s the difference between static and dynamic QR codes?",
        answer:"Static QR codes contain the link directly and cannot be changed. Dynamic QR codes redirect through a server, allowing the destination to be updated later."
      },
      {
        question:"Are dynamic QR codes free?",
        answer:"No. Dynamic QR codes require an active plan because they rely on server infrastructure."
      },
      {
        question:"Can I use these QR codes for printing?",
        answer:"Yes. The generated QR codes are high-resolution and suitable for posters, menus, packaging, and business cards."
      },
      {
        question:"Do you add tracking or analytics to free QR codes?",
        answer:"No. Static QR codes do not include tracking."
      },
    ],
  },
  why:{
    title:"Why This QR Code Generator Exists",
    subtitle:["Many QR code tools advertise “free” but rely on expiring links or hidden restrictions. This project was built to offer a simple and honest alternative.","Free static QR codes should stay free.  Paid features should be clear and optional."],
    img:"others-vs-us",
    notice:"No tricks. No forced sign-ups. No surprises."
  }
};