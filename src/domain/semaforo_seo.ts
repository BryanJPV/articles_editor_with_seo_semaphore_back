export interface SemaforoSeoUsecase {
    pasive_voice_analisis(frases: string[]) : Promise<number | null>;
}