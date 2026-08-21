import type { Translations } from "./types";
import type { LocaleCode } from "../config";
import { createLegacyTranslations } from "./legacy";

// Translation files mapped to locale codes
// Files with Translations type (default exports)
import en from "./en";
import fr from "./fr";
import de from "./de";
import es from "./es";
import it from "./it";
import pl from "./pl";
import ru from "./ru";
import sv from "./sv";
import uk from "./uk";
import zhCN from "./zh-CN";
import zhTW from "./zh-TW";

// Files with named exports - legacy translation format
import { am } from "./am";
import { ar } from "./ar";
import { cre } from "./cre";
import { den } from "./den";
import { fa } from "./fa";
import { ja } from "./ja";
import { ko } from "./ko";
import { ht } from "./ht";
import { oji } from "./oji";
import { moh } from "./moh";
import { iku } from "./iku";
import { lou } from "./lou";
import { mic } from "./mic";
import { nl } from "./nl";
import { sw } from "./sw";
import { yo } from "./yo";
import { zu } from "./zu";

// Build translations map with fallbacks for unconverted files
const translationsMap: Record<LocaleCode, Translations> = {
  en,
  fr,
  de,
  es,
  it,
  nl: createLegacyTranslations(nl),
  pl,
  ru,
  uk,
  ja: createLegacyTranslations(ja),
  ko: createLegacyTranslations(ko),
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  ar: createLegacyTranslations(ar),
  fa: createLegacyTranslations(fa),
  sw: createLegacyTranslations(sw),
  yo: createLegacyTranslations(yo),
  zu: createLegacyTranslations(zu),
  am: createLegacyTranslations(am),
  ht: createLegacyTranslations(ht),
  lou: createLegacyTranslations(lou),
  sv,
  cre: createLegacyTranslations(cre),
  oji: createLegacyTranslations(oji),
  moh: createLegacyTranslations(moh),
  mic: createLegacyTranslations(mic),
  iku: createLegacyTranslations(iku),
  den: createLegacyTranslations(den),
};

export default translationsMap;
