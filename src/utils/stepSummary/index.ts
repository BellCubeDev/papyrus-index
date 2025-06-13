
export enum StepSummaryWorkerMessageType {
    AppendToSection,
}

export enum StepSummarySection {
    /** Section for warnings about a MediaWiki's formatting (e.g. there's a misnamed function parameter) */
    MediaWikiFormattingWarnings,

    /** Section for warnings about a GitHub Wiki's formatting (e.g. required markdown headers are missing) */
    GitHubWikiFormattingWarnings,

    /** Section for listing which mods were downloaded */
    DownloadedMods,

    /** Section for warnings about features that aren't implemented yet */
    UnimplementedFeatures,

    /** Sections for warnings produced by the Sass compiler */
    SassWarnings,
}

export interface StepSummaryWorkerMessageBase {
    type: StepSummaryWorkerMessageType;
}

export interface StepSummaryWorkerMessageAppendToSection extends StepSummaryWorkerMessageBase {
    type: StepSummaryWorkerMessageType.AppendToSection;
    message: string;
    section: StepSummarySection;
    uniqueIdentifier: string;
}

export type StepSummaryWorkerMessage = StepSummaryWorkerMessageAppendToSection;


/**
 * Appends a message to the step summary section when running in a CI environment.
 * This function is a no-op when running in a non-CI environment.
 *
 * Messages will be deduped based on the `uniqueIdentifier` parameter.
 * The longest version of the message with a given unique identifier will be kept.
 *
 * @param message The message to append to the step summary section.
 * @param section The section to append the message to.
 * @param uniqueIdentifier A unique identifier for the message. This is used to deduplicate messages. If not provided, the message itself will be used as the identifier.
 */
export async function appendToStepSummarySection(message: string, section: StepSummarySection, uniqueIdentifier: string = message) {
    const buildtimeSafetyFile = await import(typeof window === 'undefined' ? './appendToStepSummarySectionInternal' : '@/empty') as typeof import('./appendToStepSummarySectionInternal') | typeof import('@/empty');

    if (!('appendToStepSummarySectionInternal' in buildtimeSafetyFile)) return console.debug('Not in a buildtime context; attempted to append to job summary:', {section: StepSummarySection[section], message});
    buildtimeSafetyFile.appendToStepSummarySectionInternal(message, section, uniqueIdentifier);
}
