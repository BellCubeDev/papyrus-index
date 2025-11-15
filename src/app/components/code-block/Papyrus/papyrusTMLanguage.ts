//
//  Note on the TextMate language file used:
//
//  File taken, converted from XML to JSON, and modified from https://github.com/joelday/papyrus-lang
//      to better suit the needs of the Papyrus Index and capabilities of shiki (and, previously, Starry Night).
//
//  Copyright (c) 2019 Joel Day
//
import type { LanguageRegistration } from "shiki";
import PapyrusTMLanguage_ from "./papyrus.tmlanguage.json" with { type: "json" };

export const PapyrusTMLanguage = PapyrusTMLanguage_ satisfies LanguageRegistration;
