import * as d3 from 'd3';

export class ChartUtils {

    public static create_svg( container: HTMLElement, zindex: number = 3000 ): d3.Selection<any,any,any,any>{

        // container dimensions
        const width: number = container.clientWidth;
        const height: number = container.clientHeight;

        // creating svg
        return d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('z-index', zindex);
    }

    public static create_group( svgselection: any, margins: { top: number, bottom: number, left: number, right: number } ){
        return svgselection.append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')
    }

    // scales
    public static create_sequential_scale( domain: [number, number], range: [number, number]): d3.ScaleSequential<any, any> {
        return d3.scaleSequential().domain(domain).range(range);
    }

    public static create_band_scale( domain: string[], range: [number, number]): d3.ScaleBand<any> {
        return d3.scaleBand().domain(domain).range(range);
    }

    public static create_color_scale( domain: [number, number] ): d3.ScaleSequential<any, any> {
        return d3.scaleSequential(d3.interpolateYlGn).domain(domain);
    }

    public static change_img_src( imgContainer: HTMLElement, newsrc: string ): void {
        d3.select(imgContainer).select('img').attr('src', newsrc);
    } 
}