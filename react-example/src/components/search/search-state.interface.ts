import { ISearchResult } from './../../contracts/search-result.interface';

export interface ISearchState {
	phrase: string;
	result: ISearchResult;
}