'use strict';

import { Range } from './Positioning';
import { X12FunctionalGroup } from './X12FunctionalGroup';
import { X12Segment } from './X12Segment';
import { defaultSerializationOptions, X12SerializationOptions } from './X12SerializationOptions';

export class X12Interchange {
    constructor(segmentTerminator: string | X12SerializationOptions, elementDelimiter?: string, options?: X12SerializationOptions) {
        this.functionalGroups = new Array<X12FunctionalGroup>();

        if (typeof segmentTerminator === 'string') {
            this.segmentTerminator = segmentTerminator;
            if (typeof elementDelimiter === 'string') {
                this.elementDelimiter = elementDelimiter;
            } else {
                throw new TypeError('Parameter "elementDelimiter" must be type of string.')
            }
        } else {
            this.options = defaultSerializationOptions(segmentTerminator);
            this.segmentTerminator = this.options.segmentTerminator;
            this.elementDelimiter = this.options.elementDelimiter;
        }

        if (this.options === undefined) {
            this.options = defaultSerializationOptions(options);
        }
    }
    
    header: X12Segment;
    trailer: X12Segment;
    
    functionalGroups: X12FunctionalGroup[];
    
    segmentTerminator: string;
    elementDelimiter: string;
    options: X12SerializationOptions;

    setHeader(tag: string, elements: string[], options?: X12SerializationOptions) {
        this.header = new X12Segment(tag, options)
        this.header.setElements(elements)
    }

    setTrailer(tag: string, elements: string[], options?: X12SerializationOptions) {
        this.trailer = new X12Segment(tag, options)
        this.trailer.setElements(elements)
    }
    
    toString(options?: X12SerializationOptions): string {
        options = options
            ? defaultSerializationOptions(options)
            : this.options;
        
        let edi = this.header.toString();
        
        if (options.format) {
            edi += options.endOfLine;
        }
        
        for (let i = 0; i < this.functionalGroups.length; i++) {
            edi += this.functionalGroups[i].toString();
            
            if (options.format) {
                edi += options.endOfLine;
            }
        }
        
        edi += this.trailer.toString();
        
        return edi;
    }
    
    private _padRight(input: string, width: number): string {
        while (input.length < width) {
            input += ' ';
        }
        
        return input.substr(0, width);
    }
}