
export const pricing = {
  title: "Simple Pricing. No Hidden Limits.",
  subtitle: "Static QR codes are free. Pay only for dynamic ones.",
  content: [
    {
      title: "Dynamic QR Trial",
      subtitle: "7 days · 1 QR code",
      items: [
        "1 dynamic QR code",
        "Change destination anytime",
        "Central dashboard access",
        "Active for 7 days"
      ],
      button: {
        label: "Start free trial",
        action: "start_trial"
      }
    },
    {
      title: "From $3.50 / month",
      subtitle: "Dynamic QR codes",
      items: [
        "Unlimited dynamic QR codes",
        "Change destination link anytime",
        "Central management dashboard",
        "Designed for campaigns and updates"
      ],
      button: {
        label: "Get Pro",
        action: "get_monthly_pro"
      }
    }
  ],
  footer:
    "Dynamic QR codes rely on server infrastructure and remain active only while the plan is active.",
  faq: {
    title: "Pricing FAQ",
    content: [
      {
        question: "Do free QR codes expire?",
        answer: "No. Static QR codes do not expire."
      },
      {
        question: "Why are dynamic QR codes paid?",
        answer: "They require ongoing server resources."
      },
      {
        question: "Can I switch plans later?",
        answer: "Yes."
      }
    ]
  },
  unsure: {
    title: "Not sure which one you need?",
    subtitle:
      "Start with a free static QR code. Upgrade only if you need to change the destination later.",
    button: {
      label: "Generate a free QR code",
      action: "go_to_generator"
    }
  }
}
