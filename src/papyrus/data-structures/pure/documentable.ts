export interface PapyrusScriptDocumentableOnlyByComment {
    /** A comment documenting this object. Unofficial, hacky, and NOT compiled into the PEX file */
    documentationComment: string | null;
}

export interface PapyrusScriptDocumentable extends PapyrusScriptDocumentableOnlyByComment {
    /** The official documentation string for this object, as would be compiled into the PEX file */
    documentationString: string | null;
}
