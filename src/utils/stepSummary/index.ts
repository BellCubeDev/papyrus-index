
export enum StepSummaryWorkerMessageType {
    AppendToSection,
}

export enum StepSummarySection {
    /** Section for warnings about the MediaWiki data's formatting (e.g. there's a misnamed function parameter) */
    MediaWikiFormattingWarnings,

    /** Section for listing which mods were downloaded */
    DownloadedMods,

    /** Section for warnings about features that aren't implemented yet */
    UnimplementedFeatures,
}

export interface StepSummaryWorkerMessageBase {
    type: StepSummaryWorkerMessageType;
}

export interface StepSummaryWorkerMessageAppendToSection extends StepSummaryWorkerMessageBase {
    type: StepSummaryWorkerMessageType.AppendToSection;
    message: string;
    section: StepSummarySection;
}

export type StepSummaryWorkerMessage = StepSummaryWorkerMessageAppendToSection;


export async function appendToStepSummarySection(message: string, section: StepSummarySection) {
    const buildtimeSafetyFile = await import(typeof window === 'undefined' ? './appendToStepSummarySectionInternal' : '@/empty') as typeof import('./appendToStepSummarySectionInternal') | typeof import('@/empty');

    if (!('appendToStepSummarySectionInternal' in buildtimeSafetyFile)) return console.debug('Not in a buildtime context; attempted to append to job summary:', {section: StepSummarySection[section], message});
    buildtimeSafetyFile.appendToStepSummarySectionInternal(message, section);
}
