export const generator = {
  title: "Vous pouvez générer et télécharger gratuitement. La sauvegarde nécessite un compte.",
  inputs: {
    url: { text: "URL", placeholder: "https://example.com" },
    name: { text: "Nom du QR (optionnel)", placeholder: "Utilisé uniquement si vous sauvegardez" },
    text: { text: "Texte", placeholder: "Saisissez votre texte ici" },
    ssid: { text: "Nom du Wi-Fi (SSID)", placeholder: "Nom du réseau" },
    password: { text: "Mot de passe Wi-Fi", placeholder: "Mot de passe" },
  },
  designer: {
    body_p: "Motif principal",
    body_c: "Couleur principale",
    eye_f: "Cadre de l'œil",
    eye_b: "Pupille de l'œil",
    eye_c: "Couleur de l'œil",
    bg_c: "Couleur de fond",
  },
  logo: { title: "Logo", upload: "Télécharger un logo", change: "Changer le logo", icon: "upload", note: "Max 2Mo. PNG transparent recommandé.", rmv_bg: "Supprimer l'arrière-plan" },
  download: { title: "Télécharger", icon: "download", note: "QR statique gratuit • Sans expiration" },
  save: { title: "Sauvegarder", icon: "save", note: "Voulez-vous sauvegarder ce QR code ou en gérer plusieurs ?" ,limit_reached:"----"},
  signin: { title: "Se connecter", icon: "save", note: "Connectez-vous pour sauvegarder jusqu'à 10 QR codes" },
  footer: "Les QR codes sont souvent annoncés comme « gratuits » mais cessent de fonctionner après un certain temps. Ce générateur crée des QR codes statiques qui n'expirent jamais. Parfait pour les supports imprimés comme les affiches, les menus, les emballages et les cartes de visite."
}