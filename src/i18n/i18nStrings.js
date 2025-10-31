import { Sphere } from "@react-three/drei";

export const t = {
  // Generic actions / buttons
  cancel:        { en: "Cancel",        sv: "Avbryt" },
  finish:        { en: "Finished!",        sv: "Färdig!" },
  done:          { en: "Done",          sv: "Klar" },
  next:          { en: "Next →",          sv: "Nästa →" },
  
  

  // FireworkBox view
  packTitle: {
    // we'll inject slotsAmount before rendering, but base text is here
    en: "{n}-Pack Firework Box",
    sv: "{n}-Pack Fyrverkerilåda",
  },
  statusLine: {
    // "{done} done · {left} left"
    en: "{done} done · {left} left",
    sv: "{done} klar · {left} kvar",
  },
  addAnother: {
    en: "Add another firework!",
    sv: "Lägg till ett fyrverkeri!",
  },

  // TypeDesign view
  selectTypeTitle: {
    en: "Select a firework type",
    sv: "Välj fyrverkerityp",
  },
  paintable: {
    en: "Paintable",
    sv: "Måla själv",
  },
  Sphere:{
    en: "Sphere",
    sv: "Sfär"
  },
  Willow:{
    en: "Willow",
    sv: "Vattenfall"
  },
  Saturn:{
    en: "Saturn",
    sv: "Saturnus"
  },
  Cluster:{
    en: "Cluster",
    sv: "Småttingar"
  },
  Sparkle:{
    en: "Sparkle",
    sv: "Glitter"
  },
  Pistil:{
    en: "Pistil",
    sv: "Blomma"
  },
  Chrysanth:{
    en: "Chrysanth",
    sv: "Krysantemum"
  },
  
  Tornado:{
    en: "Tornado",
    sv: "Tornado"
  },
  Swarm:{
    en: "Fire Flies",
    sv: "Eldflugor"
  },
  

  // SettingsDesign view
  selectPrimaryColor: {
    en: "Select the primary color",
    sv: "Välj primärfärg",
  },
  selectSecondaryColor: {
    en: "Select the secondary color",
    sv: "Välj sekundärfärg",
  },
  fireworkSettingsHeader: {
    en: "More Firework Settings",
    sv: "Flera Fyrverkeri-inställningar",
  },
  sfxAmount: {
    en: "Special Effects Amount",
    sv: "Mängd Specialeffekt",
  },
  launchSpeed: {
    en: "Launch Speed",
    sv: "Uppskjutningshastighet",
  },
  launchWobble: {
    en: "Launch Wobble",
    sv: "Luftfärds-Skakighet",
  },

  // Information view
  BuildingFireworks: {
    en: "Build your dream fireworks",
    sv: "Bygg dina dröm fyrverkerier"
  },
  chooseLanguageHeader: {
    en: "Choose language",
    sv: "Välj språk",
  },
  englishLabel: {
    en: "English",
    sv: "Engelska",
  },
  swedishLabel: {
    en: "Swedish",
    sv: "Svenska",
  },
  information:{
    en: "Please increase the brightness and volume for full experience",
    sv: "Höj gärna ljusstyrkan och ljudvolymen för bästa upplevelse"
  },
  //DrawDesign view
  drawOptionalHeader: {
    en: "Optional: Draw your firework!",
    sv: "Valfritt: Rita ditt fyrverkeri!",
  },

  clearDrawing: {
    en: "Clear drawing",
    sv: "Rensa målning",
  },
  // Launch view
  launch: {
    en: "Launch!",
    sv: "Avfyra!",
  },
  infoTitle: {
    en: "Important!",
    sv: "Viktigt!"
  },
  infoText: {
    en: "Please place your phone down against the wall within the launch area and only after that press \"Launch!\". Make sure that the WizzyWork camera can see the QR-code.",
    sv: "Ni kan endast avfyra i avfyrningsområdet. Var god ställ ner er mobil mot äggen och tryck på \"Avfyra!\" först då."
  },
  dontShowAgain: {
    en: "Don't show this again",
    sv: "Visa inte detta igen"
  },
  newFw: {
    en: "New fireworks",
    sv: "Nya fyrverkerier"
  },
  reuseFw: {
    en: "Reuse them",
    sv: "Återanvänd dem"
  },
  
  // Error handling
  connectionError: {
    en: "Connection Error",
    sv: "Anslutningsfel"
  },
  tryAgain: {
    en: "Try Again",
    sv: "Försök igen"
  },
  back: {
    en: "Back",
    sv: "Tillbaka"
  },
  waitingForDevice: {
    en: "Waiting for launch",
    sv: "Väntar på avfyrning"
  },
  connecting: {
    en: "Connecting...",
    sv: "Ansluter..."
  },
  placePhoneInstruction: {
    en: "Place the phone in the launch area and press Launch",
    sv: "Placera telefonen i avfyrningsområdet och tryck på Avfyra"
  },
  deviceDetected: {
    en: "Server connected, waiting for launch system...",
    sv: "Server ansluten, väntar på avfyrningssystem..."
  },
  establishingConnection: {
    en: "Establishing connection to launch system",
    sv: "Upprättar anslutning till avfyrningssystemet"
  },
  
  // WebSocket error messages
  wsErrorConnectionTimeout: {
    en: "Connection timeout. Please try again.",
    sv: "Anslutningen tog för lång tid. Försök igen."
  },
  wsErrorNoResponse: {
    en: "No response from launch system. Please try again.",
    sv: "Inget svar från avfyrningssystemet. Försök igen."
  },
  wsErrorSendConnection: {
    en: "Failed to send connection message. Please try again.",
    sv: "Kunde inte skicka anslutningsmeddelande. Försök igen."
  },
  wsErrorSendFirework: {
    en: "Failed to send firework data. Please try again.",
    sv: "Kunde inte skicka fyrverkeridata. Försök igen."
  },
  wsErrorProcessResponse: {
    en: "Error processing server response. Please try again.",
    sv: "Fel vid bearbetning av serversvar. Försök igen."
  },
  wsErrorNetwork: {
    en: "Connection error. Please check your network and try again.",
    sv: "Anslutningsfel. Kontrollera ditt nätverk och försök igen."
  },
  wsErrorClosedUnexpectedly: {
    en: "Connection closed unexpectedly. Please try again.",
    sv: "Anslutningen stängdes oväntat. Försök igen."
  },
};