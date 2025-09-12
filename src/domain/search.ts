export interface SearchUsecase {
    search(search_string: string) : Promise<any>;
}