
export const generator = {
  title:"You can generate and download for free. Saving requires an account.",
  inputs:{
    url:{ text: "URL", placeholder:"https://example.com"},
    name:{ text: "QR Name (optional)", placeholder: "Only used if you sign in and save" },
    text:{text: "text", placeholder: "Enter your text here"},
    ssid:{ text:"Wi-Fi SSID", placeholder:"Network Name",},
    password:{ text:"Wi-Fi Password", placeholder:"password" },
  },
  designer:{
    body_p: "Body Pattern",
    body_c: "Body Color",
    eye_f: "Eye Frame",
    eye_b: "Eye Ball",
    eye_c: "Eye color",
    bg_c: "Background Color",
  },
  logo: { title: "logo", upload:"Upload Logo", change:"Change Logo", icon:"upload", note:"Max 2MB. Transparent PNG recommended.", rmv_bg:"Remove Background"},
  download: { title:"Download", icon:"download", note:"Free static QR • No expiration"},
  save: { title:"Save to Dashboard", icon:"save", note:"save this QR code or manage multiple ones", limit_reached:"Free plan limit reached (10 QR codes)."},
  signin: { title:"Sign in to Save", icon:"save", note:"Sign in to save up to 10 free static QR codes" },
  footer:"QR codes are often advertised as “free” but stop working after a while. This generator creates static QR codes that never expire. Perfect for printed materials like posters, menus, packaging, and business cards."
}