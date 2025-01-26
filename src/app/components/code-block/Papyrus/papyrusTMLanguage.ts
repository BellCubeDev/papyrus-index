//
//  Note on the TextMate language file used:
//
//  File taken, converted from XML to JSON, and modified from https://github.com/joelday/papyrus-lang
//      to better suit the needs of the Papyrus Index and capabilities of Starry Night.
//
//  Copyright (c) 2019 Joel Day
//
import PapyrusTMLanguageRaw from "./papyrus.tmlanguage.json" assert { type: "json" };

import { Grammar } from "@wooorm/starry-night";
import type { Rule } from "@wooorm/starry-night/lib/types";

export const PapyrusTMLanguage = {
    ...PapyrusTMLanguageRaw,
    patterns: PapyrusTMLanguageRaw.patterns as Rule[],
    extensions: ["psc"],
    names: ["Papyrus"],
} satisfies Grammar;
