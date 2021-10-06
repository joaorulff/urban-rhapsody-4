import { Injectable } from "@angular/core";
import { DataLoadingAPI } from "../api/dataloading.api";
import { LearnAPI } from "../api/learn.api";
import { GlobalEvents } from "../events/global.events";
import { AudioFrame } from "../model/audioframe.model";
import { AudioSnippet } from "../model/audiosnippet.model";
import { Deserializer } from "../utils/deserializer.util";
import * as _ from 'lodash';
import { FrameFilters } from "../utils/filters/frameFilters.utils";

@Injectable({
    providedIn: 'root'
})

export class DataState {

    // loaded days
    public loadedDays: Set<string> = new Set<string>();

    // year distribution of events
    public yearAudioDistribution: { [ datetime: string ]: { count: number, frames: string[] } } = {};

    // all points loaded at beginning
    public indexedSnippets: { [snippetKey: string]: AudioSnippet }  = {};
    public indexedFrames: { [frameKey: string]: AudioFrame }  = {};

    // all points selected in a bounding box selection
    public selectedFrames: AudioFrame[] = [];
    public selectedSnippets: AudioSnippet[] = [];

    constructor( public globalEvents: GlobalEvents ){}


    public is_daily_data_loaded(): boolean {
        return Object.keys( this.indexedSnippets ).length > 0
    }

    public is_yearly_data_loaded(): boolean{
        return Object.keys(this.yearAudioDistribution ).length > 0;
    }

    public select_frames( params: any = {} ): void {

        let selection: { frames: AudioFrame[], snippets: AudioSnippet[] };

        // unselecting all frames before
        selection = FrameFilters.unselect_all( this.selectedFrames );
        this.selectedFrames = selection.frames;
        this.selectedSnippets = selection.snippets;

        // filtering 
        selection = FrameFilters.filter_proxy( this.indexedFrames, params );
        this.selectedFrames = selection.frames;
        this.selectedSnippets = selection.snippets;
    } 

    // loads the year distribution of similar events
    public async load_year_distribution( frames: AudioFrame[] ): Promise<void> {

        this.flush_loaded_data();

        const response: any = await LearnAPI.load_year_distribution( frames, 'UST');
        _.forEach( response, yeardistribution => {
            this.yearAudioDistribution = yeardistribution;
        });

        // emitting loaded event
        this.globalEvents.yearDistributionLoaded.emit();

    } 

    public async load_data( datasetname: string, filters: any = {} ): Promise<void> {

        // flushing loaded data;
        this.flush_loaded_data();

        // saving all loaded days
        this.loadedDays = new Set( filters.days );

        const lodadeData: any = await DataLoadingAPI.load_data( datasetname, filters );
        const indexedData: {indexedSnippets: any, indexedFrames: any} = Deserializer.deserialize_snippets( lodadeData );

        // saving indexed data
        this.indexedSnippets = indexedData.indexedSnippets;
        this.indexedFrames = indexedData.indexedFrames;
        
        // emitting loaded event
        this.globalEvents.dataLoadDone.emit();
        
    }


    public flush_loaded_data(): void {

        // unselecting all frames before
        const selection = FrameFilters.unselect_all( this.selectedFrames );
        this.selectedFrames = selection.frames;
        this.selectedSnippets = selection.snippets;

        // all points loaded at beginning
        this.indexedFrames = {};
        this.indexedSnippets = {};

    }

}