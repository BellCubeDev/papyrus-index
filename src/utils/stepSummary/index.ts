
export enum JobSummaryWorkerMessageType {
    AppendToSection,
}

export enum JobSummarySection {
    /** Section for warnings about the MediaWiki data's formatting (e.g. there's a misnamed function parameter) */
    MediaWikiFormattingWarnings,

    /** Section for listing which mods were downloaded */
    DownloadedMods,

    /** Section for warnings about features that aren't implemented yet */
    UnimplementedFeatures,
}

export interface JobSummaryWorkerMessageBase {
    type: JobSummaryWorkerMessageType;
}

export interface JobSummaryWorkerMessageAppendToSection extends JobSummaryWorkerMessageBase {
    type: JobSummaryWorkerMessageType.AppendToSection;
    message: string;
    section: JobSummarySection;
}

export type JobSummaryWorkerMessage = JobSummaryWorkerMessageAppendToSection;


export async function appendToJobSummarySection(message: string, section: JobSummarySection) {
    const buildtimeSafetyFile = await import(typeof window === 'undefined' ? './appendToJobSummarySectionInternal' : '@/empty') as typeof import('./appendToJobSummarySectionInternal') | typeof import('@/empty');

    if (!('appendToJobSummarySectionInternal' in buildtimeSafetyFile)) return console.debug('Not in a buildtime context; attempted to append to job summary:', {section: JobSummarySection[section], message});
    buildtimeSafetyFile.appendToJobSummarySectionInternal(message, section);
}
