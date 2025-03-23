import { LocaleConfig } from 'react-native-calendars';

// Set up French locale for the calendar.
LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ],
  monthNamesShort: [
    'janv.', 'févr.', 'mars', 'avr.', 'mai.', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
  ],
  dayNames: [
    'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi',
  ],
  dayNamesShort: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = 'fr';

export default LocaleConfig;
