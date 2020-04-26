import { getUsedLanguage } from './i18n'

export default function (nbr) {
  if (getUsedLanguage() !== 'arabic')
    return nbr
  const arNumbers = ['۰', '۱', '۲', '۳', '٤', '٥', '٦', '۷', '۸', '۹'];
  return nbr.replace(/[0-9]/g, function (w) {
    return arNumbers[+w]
  });
}