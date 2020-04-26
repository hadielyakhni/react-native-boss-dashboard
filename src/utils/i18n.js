import * as RNLocalize from "react-native-localize";
import { Platform } from 'react-native'
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import RNFS from "react-native-fs";

import { I18nManager } from "react-native";

let languageUsed = 'system', isUsedLanguageRTL, isSystem

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = async (languageTagByUser, isRTLByUser) => {
  const translationsDir = await (Platform.OS === "android"
    ? RNFS.readDirAssets("translations")
    : RNFS.readDir(RNFS.MainBundlePath + "/translations"));
  const translationPaths = translationsDir
    .filter(({ isFile, name }) => isFile() && name.endsWith(".json"))
    .reduce((all, { name, path }) => {
      const languageTag = name.replace(".json", "");
      return { ...all, [languageTag]: path };
    }, {});
  if (languageTagByUser) {
    const fileContent = await (Platform.OS === "android"
      ? RNFS.readFileAssets(translationPaths[languageTagByUser], "utf8")
      : RNFS.readFile(translationPaths[languageTagByUser], "utf8"));
    languageUsed = languageTagByUser
    isUsedLanguageRTL = isRTLByUser
    isSystem = false
    translate.cache.clear()
    I18nManager.forceRTL(isRTLByUser)
    i18n.translations = { [languageTagByUser]: JSON.parse(fileContent) };
    i18n.locale = languageTagByUser;
  }
  else {
    const fallback = { languageTag: "en", isRTL: false }
    const { languageTag, isRTL } =
      RNLocalize.findBestAvailableLanguage(Object.keys(translationPaths)) ||
      fallback;
    const fileContent = await (Platform.OS === "android"
      ? RNFS.readFileAssets(translationPaths[languageTag], "utf8")
      : RNFS.readFile(translationPaths[languageTag], "utf8"));
    languageUsed = languageTag
    isUsedLanguageRTL = isRTL
    isSystem = true
    translate.cache.clear()
    I18nManager.forceRTL(isRTL)
    i18n.translations = { [languageTag]: JSON.parse(fileContent) };
    i18n.locale = languageTag;
  }
};

export const getUsedLanguage = () => {
  switch (languageUsed) {
    case 'en':
      return 'english'
    case 'fr':
      return 'french'
    case 'ar':
      return 'arabic'
  }
}

export const isUsedLanguageSystem = () => isSystem

export const isRTL = () => isUsedLanguageRTL