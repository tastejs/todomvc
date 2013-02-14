/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/charts-legend/charts-legend.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/charts-legend/charts-legend.js",
    code: []
};
_yuitest_coverage["build/charts-legend/charts-legend.js"].code=["YUI.add('charts-legend', function (Y, NAME) {","","/**"," * Adds legend functionality to charts."," *"," * @module charts"," * @submodule charts-legend"," */","var DOCUMENT = Y.config.doc, ","TOP = \"top\",","RIGHT = \"right\",","BOTTOM = \"bottom\",","LEFT = \"left\",","EXTERNAL = \"external\",","HORIZONTAL = \"horizontal\",","VERTICAL = \"vertical\",","WIDTH = \"width\",","HEIGHT = \"height\",","POSITION = \"position\",","_X = \"x\",","_Y = \"y\",","PX = \"px\",","LEGEND = {","    setter: function(val)","    {   ","        var legend = this.get(\"legend\");","        if(legend)","        {","            legend.destroy(true);","        }","        if(val instanceof Y.ChartLegend)","        {","            legend = val;","            legend.set(\"chart\", this);","        }","        else","        {","            val.chart = this;","            if(!val.hasOwnProperty(\"render\"))","            {","                val.render = this.get(\"contentBox\");","                val.includeInChartLayout = true;","            }","            legend = new Y.ChartLegend(val);","        }","        return legend;","    }","},","","/**"," * Contains methods for displaying items horizontally in a legend."," *"," * @module charts"," * @submodule charts-legend"," * @class HorizontalLegendLayout"," */","HorizontalLegendLayout = {","    /**","     * Displays items horizontally in a legend.","     *","     * @method _positionLegendItems","     * @param {Array} items Array of items to display in the legend.","     * @param {Number} maxWidth The width of the largest item in the legend.","     * @param {Number} maxHeight The height of the largest item in the legend.","     * @param {Number} totalWidth The total width of all items in a legend.","     * @param {Number} totalHeight The total height of all items in a legend.","     * @param {Number} padding The left, top, right and bottom padding properties for the legend.","     * @param {Number} horizontalGap The horizontal distance between items in a legend.","     * @param {Number} verticalGap The vertical distance between items in a legend.","     * @param {String} hAlign The horizontal alignment of the legend.","     * @param {String} vAlign The vertical alignment of the legend.","     * @protected","     */","    _positionLegendItems: function(items, maxWidth, maxHeight, totalWidth, totalHeight, padding, horizontalGap, verticalGap, hAlign, vAlign)","    {","        var i = 0,","            rowIterator = 0,","            item,","            node,","            itemWidth,","            itemHeight,","            len,","            width = this.get(\"width\"),","            rows,","            rowsLen,","            row,","            totalWidthArray,","            legendWidth,","            topHeight = padding.top - verticalGap,","            limit = width - (padding.left + padding.right),","            left, ","            top,","            right,","            bottom;","        HorizontalLegendLayout._setRowArrays(items, limit, horizontalGap);","        rows = HorizontalLegendLayout.rowArray;","        totalWidthArray = HorizontalLegendLayout.totalWidthArray;","        rowsLen = rows.length;","        for(; rowIterator < rowsLen; ++ rowIterator)","        {","            topHeight += verticalGap;","            row = rows[rowIterator];","            len = row.length;","            legendWidth =  HorizontalLegendLayout.getStartPoint(width, totalWidthArray[rowIterator], hAlign, padding);","            for(i = 0; i < len; ++i)","            {","                item = row[i];","                node = item.node;","                itemWidth = item.width;","                itemHeight = item.height;","                item.x = legendWidth;","                item.y = 0;","                left = !isNaN(left) ? Math.min(left, legendWidth) : legendWidth;","                top = !isNaN(top) ? Math.min(top, topHeight) : topHeight;","                right = !isNaN(right) ? Math.max(legendWidth + itemWidth, right) : legendWidth + itemWidth;","                bottom = !isNaN(bottom) ? Math.max(topHeight + itemHeight, bottom) : topHeight + itemHeight;","                node.setStyle(\"left\", legendWidth + PX);","                node.setStyle(\"top\", topHeight + PX);","                legendWidth += itemWidth + horizontalGap;","            }","            topHeight += item.height;","        }","        this._contentRect = {","            left: left,","            top: top,","            right: right,","            bottom: bottom","        };","        if(this.get(\"includeInChartLayout\"))","        {","            this.set(\"height\", topHeight + padding.bottom);","        }","    },","","    /**","     * Creates row and total width arrays used for displaying multiple rows of","     * legend items based on the items, available width and horizontalGap for the legend.","     *","     * @method _setRowArrays","     * @param {Array} items Array of legend items to display in a legend.","     * @param {Number} limit Total available width for displaying items in a legend.","     * @param {Number} horizontalGap Horizontal distance between items in a legend.","     * @protected","     */","    _setRowArrays: function(items, limit, horizontalGap)","    {","        var item = items[0],","            rowArray = [[item]],","            i = 1,","            rowIterator = 0,","            len = items.length,","            totalWidth = item.width,","            itemWidth,","            totalWidthArray = [[totalWidth]];","        for(; i < len; ++i)","        {","            item = items[i];","            itemWidth = item.width;","            if((totalWidth + horizontalGap + itemWidth) <= limit)","            {","                totalWidth += horizontalGap + itemWidth;","                rowArray[rowIterator].push(item);","            }","            else","            {","                totalWidth = horizontalGap + itemWidth;","                if(rowArray[rowIterator])","                {","                    rowIterator += 1;","                }","                rowArray[rowIterator] = [item];","            }","            totalWidthArray[rowIterator] = totalWidth;","        }","        HorizontalLegendLayout.rowArray = rowArray;","        HorizontalLegendLayout.totalWidthArray = totalWidthArray;","    },","","    /**","     * Returns the starting x-coordinate for a row of legend items.","     *","     * @method getStartPoint","     * @param {Number} w Width of the legend.","     * @param {Number} totalWidth Total width of all labels in the row.","     * @param {String} align Horizontal alignment of items for the legend.","     * @param {Object} padding Object contain left, top, right and bottom padding properties.","     * @return Number","     * @protected","     */","    getStartPoint: function(w, totalWidth, align, padding)","    {","        var startPoint;","        switch(align)","        {","            case LEFT :","                startPoint = padding.left;","            break;","            case \"center\" :","                startPoint = (w - totalWidth) * 0.5;","            break;","            case RIGHT :","                startPoint = w - totalWidth - padding.right;","            break;","        }","        return startPoint;","    }","},","","/**"," * Contains methods for displaying items vertically in a legend."," *"," * @module charts"," * @submodule charts-legend"," * @class VerticalLegendLayout"," */","VerticalLegendLayout = {","    /**","     * Displays items vertically in a legend.","     *","     * @method _positionLegendItems","     * @param {Array} items Array of items to display in the legend.","     * @param {Number} maxWidth The width of the largest item in the legend.","     * @param {Number} maxHeight The height of the largest item in the legend.","     * @param {Number} totalWidth The total width of all items in a legend.","     * @param {Number} totalHeight The total height of all items in a legend.","     * @param {Number} padding The left, top, right and bottom padding properties for the legend.","     * @param {Number} horizontalGap The horizontal distance between items in a legend.","     * @param {Number} verticalGap The vertical distance between items in a legend.","     * @param {String} hAlign The horizontal alignment of the legend.","     * @param {String} vAlign The vertical alignment of the legend.","     * @protected","     */","    _positionLegendItems: function(items, maxWidth, maxHeight, totalWidth, totalHeight, padding, horizontalGap, verticalGap, hAlign, vAlign)","    {","        var i = 0,","            columnIterator = 0,","            item,","            node,","            itemHeight,","            itemWidth,","            len,","            height = this.get(\"height\"),","            columns,","            columnsLen,","            column,","            totalHeightArray,","            legendHeight,","            leftWidth = padding.left - horizontalGap,","            legendWidth,","            limit = height - (padding.top + padding.bottom),","            left, ","            top,","            right,","            bottom;","        VerticalLegendLayout._setColumnArrays(items, limit, verticalGap);","        columns = VerticalLegendLayout.columnArray;","        totalHeightArray = VerticalLegendLayout.totalHeightArray;","        columnsLen = columns.length;","        for(; columnIterator < columnsLen; ++ columnIterator)","        {","            leftWidth += horizontalGap;","            column = columns[columnIterator];","            len = column.length;","            legendHeight =  VerticalLegendLayout.getStartPoint(height, totalHeightArray[columnIterator], vAlign, padding);","            legendWidth = 0;","            for(i = 0; i < len; ++i)","            {","                item = column[i];","                node = item.node;","                itemHeight = item.height;","                itemWidth = item.width;","                item.y = legendHeight;","                item.x = leftWidth;","                left = !isNaN(left) ? Math.min(left, leftWidth) : leftWidth;","                top = !isNaN(top) ? Math.min(top, legendHeight) : legendHeight;","                right = !isNaN(right) ? Math.max(leftWidth + itemWidth, right) : leftWidth + itemWidth;","                bottom = !isNaN(bottom) ? Math.max(legendHeight + itemHeight, bottom) : legendHeight + itemHeight;","                node.setStyle(\"left\", leftWidth + PX);","                node.setStyle(\"top\", legendHeight + PX);","                legendHeight += itemHeight + verticalGap;","                legendWidth = Math.max(legendWidth, item.width);","            }","            leftWidth += legendWidth;","        }","        this._contentRect = {","            left: left,","            top: top,","            right: right,","            bottom: bottom","        };","        if(this.get(\"includeInChartLayout\"))","        {","            this.set(\"width\", leftWidth + padding.right);","        }","    },","","    /**","     * Creates column and total height arrays used for displaying multiple columns of","     * legend items based on the items, available height and verticalGap for the legend.","     *","     * @method _setColumnArrays","     * @param {Array} items Array of legend items to display in a legend.","     * @param {Number} limit Total available height for displaying items in a legend.","     * @param {Number} verticalGap Vertical distance between items in a legend.","     * @protected","     */","    _setColumnArrays: function(items, limit, verticalGap)","    {","        var item = items[0],","            columnArray = [[item]],","            i = 1,","            columnIterator = 0,","            len = items.length,","            totalHeight = item.height,","            itemHeight,","            totalHeightArray = [[totalHeight]];","        for(; i < len; ++i)","        {","            item = items[i];","            itemHeight = item.height;","            if((totalHeight + verticalGap + itemHeight) <= limit)","            {","                totalHeight += verticalGap + itemHeight;","                columnArray[columnIterator].push(item);","            }","            else","            {","                totalHeight = verticalGap + itemHeight;","                if(columnArray[columnIterator])","                {","                    columnIterator += 1;","                }","                columnArray[columnIterator] = [item];","            }","            totalHeightArray[columnIterator] = totalHeight;","        }","        VerticalLegendLayout.columnArray = columnArray;","        VerticalLegendLayout.totalHeightArray = totalHeightArray;","    },","","    /**","     * Returns the starting y-coordinate for a column of legend items.","     *","     * @method getStartPoint","     * @param {Number} h Height of the legend.","     * @param {Number} totalHeight Total height of all labels in the column.","     * @param {String} align Vertical alignment of items for the legend.","     * @param {Object} padding Object contain left, top, right and bottom padding properties.","     * @return Number","     * @protected","     */","    getStartPoint: function(h, totalHeight, align, padding)","    {","        var startPoint;","        switch(align)","        {","            case TOP :","                startPoint = padding.top;","            break;","            case \"middle\" :","                startPoint = (h - totalHeight) * 0.5;","            break;","            case BOTTOM :","                startPoint = h - totalHeight - padding.bottom;","            break;","        }","        return startPoint;","    }","},","","CartesianChartLegend = Y.Base.create(\"cartesianChartLegend\", Y.CartesianChart, [], {","    /**","     * Redraws and position all the components of the chart instance.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        if(this._drawing)","        {","            this._callLater = true;","            return;","        }","        this._drawing = true;","        this._callLater = false;","        var w = this.get(\"width\"),","            h = this.get(\"height\"),","            layoutBoxDimensions = this._getLayoutBoxDimensions(),","            leftPaneWidth = layoutBoxDimensions.left,","            rightPaneWidth = layoutBoxDimensions.right,","            topPaneHeight = layoutBoxDimensions.top,","            bottomPaneHeight = layoutBoxDimensions.bottom,","            leftAxesCollection = this.get(\"leftAxesCollection\"),","            rightAxesCollection = this.get(\"rightAxesCollection\"),","            topAxesCollection = this.get(\"topAxesCollection\"),","            bottomAxesCollection = this.get(\"bottomAxesCollection\"),","            i = 0,","            l,","            axis,","            graphOverflow = \"visible\",","            graph = this.get(\"graph\"),","            topOverflow,","            bottomOverflow,","            leftOverflow,","            rightOverflow,","            graphWidth,","            graphHeight,","            graphX,","            graphY,","            allowContentOverflow = this.get(\"allowContentOverflow\"),","            diff,","            rightAxesXCoords,","            leftAxesXCoords,","            topAxesYCoords,","            bottomAxesYCoords,","            legend = this.get(\"legend\"),","            graphRect = {};","","        if(leftAxesCollection)","        {","            leftAxesXCoords = [];","            l = leftAxesCollection.length;","            for(i = l - 1; i > -1; --i)","            {","                leftAxesXCoords.unshift(leftPaneWidth);","                leftPaneWidth += leftAxesCollection[i].get(\"width\");","            }","        }","        if(rightAxesCollection)","        {","            rightAxesXCoords = [];","            l = rightAxesCollection.length;","            i = 0;","            for(i = l - 1; i > -1; --i)","            {","                rightPaneWidth += rightAxesCollection[i].get(\"width\");","                rightAxesXCoords.unshift(w - rightPaneWidth);","            }","        }","        if(topAxesCollection)","        {","            topAxesYCoords = [];","            l = topAxesCollection.length;","            for(i = l - 1; i > -1; --i)","            {","                topAxesYCoords.unshift(topPaneHeight);","                topPaneHeight += topAxesCollection[i].get(\"height\");","            }","        }","        if(bottomAxesCollection)","        {","            bottomAxesYCoords = [];","            l = bottomAxesCollection.length;","            for(i = l - 1; i > -1; --i)","            {","                bottomPaneHeight += bottomAxesCollection[i].get(\"height\");","                bottomAxesYCoords.unshift(h - bottomPaneHeight);","            }","        }","        ","        graphWidth = w - (leftPaneWidth + rightPaneWidth);","        graphHeight = h - (bottomPaneHeight + topPaneHeight);","        graphRect.left = leftPaneWidth;","        graphRect.top = topPaneHeight;","        graphRect.bottom = h - bottomPaneHeight;","        graphRect.right = w - rightPaneWidth;","        if(!allowContentOverflow)","        {","            topOverflow = this._getTopOverflow(leftAxesCollection, rightAxesCollection);","            bottomOverflow = this._getBottomOverflow(leftAxesCollection, rightAxesCollection);","            leftOverflow = this._getLeftOverflow(bottomAxesCollection, topAxesCollection);","            rightOverflow = this._getRightOverflow(bottomAxesCollection, topAxesCollection);","            ","            diff = topOverflow - topPaneHeight;","            if(diff > 0)","            {","                graphRect.top = topOverflow;","                if(topAxesYCoords)","                {","                    i = 0;","                    l = topAxesYCoords.length;","                    for(; i < l; ++i)","                    {","                        topAxesYCoords[i] += diff;","                    }","                }","            }","","            diff = bottomOverflow - bottomPaneHeight;","            if(diff > 0)","            {","                graphRect.bottom = h - bottomOverflow;","                if(bottomAxesYCoords)","                {","                    i = 0;","                    l = bottomAxesYCoords.length;","                    for(; i < l; ++i)","                    {","                        bottomAxesYCoords[i] -= diff;","                    }","                }","            }","","            diff = leftOverflow - leftPaneWidth;","            if(diff > 0)","            {","                graphRect.left = leftOverflow;","                if(leftAxesXCoords)","                {","                    i = 0;","                    l = leftAxesXCoords.length;","                    for(; i < l; ++i)","                    {","                        leftAxesXCoords[i] += diff;","                    }","                }","            }","","            diff = rightOverflow - rightPaneWidth;","            if(diff > 0)","            {","                graphRect.right = w - rightOverflow;","                if(rightAxesXCoords)","                {","                    i = 0;","                    l = rightAxesXCoords.length;","                    for(; i < l; ++i)","                    {","                        rightAxesXCoords[i] -= diff;","                    }","                }","            }","        }","        graphWidth = graphRect.right - graphRect.left;","        graphHeight = graphRect.bottom - graphRect.top;","        graphX = graphRect.left;","        graphY = graphRect.top;","        if(legend)","        {","            if(legend.get(\"includeInChartLayout\"))","            {","                switch(legend.get(\"position\"))","                {","                    case \"left\" : ","                        legend.set(\"y\", graphY);","                        legend.set(\"height\", graphHeight);","                    break;","                    case \"top\" :","                        legend.set(\"x\", graphX);","                        legend.set(\"width\", graphWidth);","                    break;","                    case \"bottom\" : ","                        legend.set(\"x\", graphX);","                        legend.set(\"width\", graphWidth);","                    break;","                    case \"right\" :","                        legend.set(\"y\", graphY);","                        legend.set(\"height\", graphHeight);","                    break;","                }","            }","        }","        if(topAxesCollection)","        {","            l = topAxesCollection.length;","            i = 0;","            for(; i < l; i++)","            {","                axis = topAxesCollection[i];","                if(axis.get(\"width\") !== graphWidth)","                {","                    axis.set(\"width\", graphWidth);","                }","                axis.get(\"boundingBox\").setStyle(\"left\", graphX + PX);","                axis.get(\"boundingBox\").setStyle(\"top\", topAxesYCoords[i] + PX);","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        if(bottomAxesCollection)","        {","            l = bottomAxesCollection.length;","            i = 0;","            for(; i < l; i++)","            {","                axis = bottomAxesCollection[i];","                if(axis.get(\"width\") !== graphWidth)","                {","                    axis.set(\"width\", graphWidth);","                }","                axis.get(\"boundingBox\").setStyle(\"left\", graphX + PX);","                axis.get(\"boundingBox\").setStyle(\"top\", bottomAxesYCoords[i] + PX);","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        if(leftAxesCollection)","        {","            l = leftAxesCollection.length;","            i = 0;","            for(; i < l; ++i)","            {","                axis = leftAxesCollection[i];","                axis.get(\"boundingBox\").setStyle(\"top\", graphY + PX);","                axis.get(\"boundingBox\").setStyle(\"left\", leftAxesXCoords[i] + PX);","                if(axis.get(\"height\") !== graphHeight)","                {","                    axis.set(\"height\", graphHeight);","                }","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        if(rightAxesCollection)","        {","            l = rightAxesCollection.length;","            i = 0;","            for(; i < l; ++i)","            {","                axis = rightAxesCollection[i];","                axis.get(\"boundingBox\").setStyle(\"top\", graphY + PX);","                axis.get(\"boundingBox\").setStyle(\"left\", rightAxesXCoords[i] + PX);","                if(axis.get(\"height\") !== graphHeight)","                {","                    axis.set(\"height\", graphHeight);","                }","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        this._drawing = false;","        if(this._callLater)","        {","            this._redraw();","            return;","        }","        if(graph)","        {","            graph.get(\"boundingBox\").setStyle(\"left\", graphX + PX);","            graph.get(\"boundingBox\").setStyle(\"top\", graphY + PX);","            graph.set(\"width\", graphWidth);","            graph.set(\"height\", graphHeight);","            graph.get(\"boundingBox\").setStyle(\"overflow\", graphOverflow);","        }","","        if(this._overlay)","        {","            this._overlay.setStyle(\"left\", graphX + PX);","            this._overlay.setStyle(\"top\", graphY + PX);","            this._overlay.setStyle(\"width\", graphWidth + PX);","            this._overlay.setStyle(\"height\", graphHeight + PX);","        }","    },","","    /**","     * Positions the legend in a chart and returns the properties of the legend to be used in the ","     * chart's layout algorithm.","     *","     * @method _getLayoutDimensions","     * @return {Object} The left, top, right and bottom values for the legend.","     * @protected","     */","    _getLayoutBoxDimensions: function()","    {","        var box = {","                top: 0,","                right: 0,","                bottom: 0,","                left: 0","            },","            legend = this.get(\"legend\"),","            position,","            direction,","            dimension,","            size,","            w = this.get(WIDTH),","            h = this.get(HEIGHT),","            gap;","        if(legend && legend.get(\"includeInChartLayout\"))","        {","            gap = legend.get(\"styles\").gap;","            position = legend.get(POSITION);","            if(position != EXTERNAL)","            {","                direction = legend.get(\"direction\");","                dimension = direction == HORIZONTAL ? HEIGHT : WIDTH;","                size = legend.get(dimension);","                box[position] = size + gap;","                switch(position)","                {","                    case TOP :","                        legend.set(_Y, 0); ","                    break;","                    case BOTTOM : ","                        legend.set(_Y, h - size); ","                    break;","                    case RIGHT :","                        legend.set(_X, w - size);","                    break;","                    case LEFT: ","                        legend.set(_X, 0);","                    break;","                }","            }","        }","        return box;","    },","","    /**","     * Destructor implementation for the CartesianChart class. Calls destroy on all axes, series, legend (if available) and the Graph instance.","     * Removes the tooltip and overlay HTML elements.","     *","     * @method destructor","     * @protected","     */","    destructor: function()","    {","        var legend = this.get(\"legend\");","        if(legend)","        {","            legend.destroy(true);","        }","    }","}, {","    ATTRS: {","        legend: LEGEND","    }","});","","Y.CartesianChart = CartesianChartLegend;","","var PieChartLegend = Y.Base.create(\"pieChartLegend\", Y.PieChart, [], {","    /**","     * Redraws the chart instance.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        if(this._drawing)","        {","            this._callLater = true;","            return;","        }","        this._drawing = true;","        this._callLater = false;","        var graph = this.get(\"graph\"),","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            graphWidth,","            graphHeight,","            legend = this.get(\"legend\"),","            x = 0,","            y = 0,","            legendX = 0,","            legendY = 0,","            legendWidth,","            legendHeight,","            dimension,","            gap,","            position,","            direction;","        if(graph)","        {","            if(legend)","            {","                position = legend.get(\"position\");","                direction = legend.get(\"direction\");","                graphWidth = graph.get(\"width\");","                graphHeight = graph.get(\"height\");","                legendWidth = legend.get(\"width\");","                legendHeight = legend.get(\"height\");","                gap = legend.get(\"styles\").gap;","                ","                if((direction == \"vertical\" && (graphWidth + legendWidth + gap !== w)) || (direction == \"horizontal\" &&  (graphHeight + legendHeight + gap !== h)))","                {","                    switch(legend.get(\"position\"))","                    {","                        case LEFT :","                            dimension = Math.min(w - (legendWidth + gap), h);","                            legendHeight = h;","                            x = legendWidth + gap;","                            legend.set(HEIGHT, legendHeight);","                        break;","                        case TOP :","                            dimension = Math.min(h - (legendHeight + gap), w); ","                            legendWidth = w;","                            y = legendHeight + gap;","                            legend.set(WIDTH, legendWidth);","                        break;","                        case RIGHT :","                            dimension = Math.min(w - (legendWidth + gap), h);","                            legendHeight = h;","                            legendX = dimension + gap;","                            legend.set(HEIGHT, legendHeight);","                        break;","                        case BOTTOM :","                            dimension = Math.min(h - (legendHeight + gap), w); ","                            legendWidth = w;","                            legendY = dimension + gap; ","                            legend.set(WIDTH, legendWidth);","                        break;","                    }","                    graph.set(WIDTH, dimension);","                    graph.set(HEIGHT, dimension);","                }","                else","                {","                    switch(legend.get(\"position\"))","                    {   ","                        case LEFT :","                            x = legendWidth + gap;","                        break;","                        case TOP :","                            y = legendHeight + gap;","                        break;","                        case RIGHT :","                            legendX = graphWidth + gap;","                        break;","                        case BOTTOM :","                            legendY = graphHeight + gap; ","                        break;","                    }","                }","            }","            else","            {","                graph.set(_X, 0);","                graph.set(_Y, 0);","                graph.set(WIDTH, w);","                graph.set(HEIGHT, h);","            }","        }","        this._drawing = false;","        if(this._callLater)","        {","            this._redraw();","            return;","        }","        if(graph)","        {","            graph.set(_X, x);","            graph.set(_Y, y);","        }","        if(legend)","        {","            legend.set(_X, legendX);","            legend.set(_Y, legendY);","        }","    }","}, {","    ATTRS: {","        /**","         * The legend for the chart.","         *","         * @attribute","         * @type Legend","         */","        legend: LEGEND","    }","});","Y.PieChart = PieChartLegend;","/**"," * ChartLegend provides a legend for a chart."," *"," * @class ChartLegend"," * @module charts"," * @submodule charts-legend"," * @extends Widget"," */","Y.ChartLegend = Y.Base.create(\"chartlegend\", Y.Widget, [Y.Renderer], {","    /**","     * Initializes the chart.","     *","     * @method initializer","     * @private","     */","    initializer: function()","    {","        this._items = [];","    },","","    /**","     * @method renderUI","     * @private","     */","    renderUI: function()","    {","        var bb = this.get(\"boundingBox\"),","            cb = this.get(\"contentBox\"),","            styles = this.get(\"styles\").background,","            background = new Y.Rect({","                graphic: cb,","                fill: styles.fill,","                stroke: styles.border","            });","        bb.setStyle(\"display\", \"block\");","        bb.setStyle(\"position\", \"absolute\");","        this.set(\"background\", background);","    },","    ","    /**","     * @method bindUI","     * @private","     */","    bindUI: function()","    {","        this.get(\"chart\").after(\"seriesCollectionChange\", Y.bind(this._updateHandler, this));","        this.after(\"stylesChange\", this._updateHandler);","        this.after(\"positionChange\", this._positionChangeHandler);","        this.after(\"widthChange\", this._handleSizeChange);","        this.after(\"heightChange\", this._handleSizeChange);","    },","    ","    /**","     * @method syncUI","     * @private","     */","    syncUI: function()","    {","        var w = this.get(\"width\"),","            h = this.get(\"height\");","        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)","        {","            this._drawLegend();","        }","    },","","    /**","     * Handles changes to legend.","     *","     * @method _updateHandler","     * @param {Object} e Event object","     * @private","     */","    _updateHandler: function(e)","    {","        if(this.get(\"rendered\"))","        {","            this._drawLegend();","        }","    },","","    /** ","     * Handles position changes.","     *","     * @method _positionChangeHandler","     * @param {Object} e Event object","     * @private","     */","    _positionChangeHandler: function(e)","    {","        var chart = this.get(\"chart\"),","            parentNode = this._parentNode;","        if(parentNode && ((chart && this.get(\"includeInChartLayout\"))))","        {","            this.fire(\"legendRendered\");","        }","        else if(this.get(\"rendered\"))","        {","            this._drawLegend();","        }","    },","","    /**","     * Updates the legend when the size changes.","     *","     * @method _handleSizeChange","     * @param {Object} e Event object.","     * @private","     */","    _handleSizeChange: function(e)","    {","        var attrName = e.attrName,","            pos = this.get(POSITION),","            vert = pos == LEFT || pos == RIGHT,","            hor = pos == BOTTOM || pos == TOP;","        if((hor && attrName == WIDTH) || (vert && attrName == HEIGHT))","        {","            this._drawLegend();","        }","    },","","    /**","     * Draws the legend","     *","     * @method _drawLegend","     * @private","     */","    _drawLegend: function()","    {","        if(this._drawing)","        {","            this._callLater = true;","            return;","        }","        this._drawing = true;","        this._callLater = false;","        if(this.get(\"includeInChartLayout\"))","        {","            this.get(\"chart\")._itemRenderQueue.unshift(this);","        }","        var chart = this.get(\"chart\"),","            node = this.get(\"contentBox\"),","            seriesCollection = chart.get(\"seriesCollection\"),","            series,","            styles = this.get(\"styles\"),","            padding = styles.padding,","            itemStyles = styles.item,","            seriesStyles,","            hSpacing = itemStyles.hSpacing,","            vSpacing = itemStyles.vSpacing,","            hAlign = styles.hAlign,","            vAlign = styles.vAlign,","            marker = styles.marker,","            labelStyles = itemStyles.label,","            displayName,","            layout = this._layout[this.get(\"direction\")],","            i, ","            len,","            isArray,","            shape,","            shapeClass,","            item,","            fill,","            border,","            fillColors,","            borderColors,","            borderWeight,","            items = [],","            markerWidth = marker.width,","            markerHeight = marker.height,","            totalWidth = 0 - hSpacing,","            totalHeight = 0 - vSpacing,","            maxWidth = 0,","            maxHeight = 0,","            itemWidth,","            itemHeight;","        if(marker && marker.shape)","        {","            shape = marker.shape;","        }","        this._destroyLegendItems();","        if(chart instanceof Y.PieChart)","        {","            series = seriesCollection[0];","            displayName = series.get(\"categoryAxis\").getDataByKey(series.get(\"categoryKey\")); ","            seriesStyles = series.get(\"styles\").marker;","            fillColors = seriesStyles.fill.colors;","            borderColors = seriesStyles.border.colors;","            borderWeight = seriesStyles.border.weight;","            i = 0;","            len = displayName.length;","            shape = shape || Y.Circle;","            isArray = Y.Lang.isArray(shape);","            for(; i < len; ++i)","            {","                shape = isArray ? shape[i] : shape;","                fill = {","                    color: fillColors[i]","                };","                border = {","                    colors: borderColors[i],","                    weight: borderWeight","                };","                displayName = chart.getSeriesItems(series, i).category.value;","                item = this._getLegendItem(node, this._getShapeClass(shape), fill, border, labelStyles, markerWidth, markerHeight, displayName);","                itemWidth = item.width;","                itemHeight = item.height;","                maxWidth = Math.max(maxWidth, itemWidth);","                maxHeight = Math.max(maxHeight, itemHeight);","                totalWidth += itemWidth + hSpacing;","                totalHeight += itemHeight + vSpacing;","                items.push(item);","            }","        }","        else","        {","            i = 0;","            len = seriesCollection.length;","            for(; i < len; ++i)","            {","                series = seriesCollection[i];","                seriesStyles = this._getStylesBySeriesType(series, shape);","                if(!shape)","                {","                    shape = seriesStyles.shape;","                    if(!shape)","                    {","                        shape = Y.Circle;","                    }","                }","                shapeClass = Y.Lang.isArray(shape) ? shape[i] : shape;","                item = this._getLegendItem(node, this._getShapeClass(shape), seriesStyles.fill, seriesStyles.border, labelStyles, markerWidth, markerHeight, series.get(\"valueDisplayName\"));","                itemWidth = item.width;","                itemHeight = item.height;","                maxWidth = Math.max(maxWidth, itemWidth);","                maxHeight = Math.max(maxHeight, itemHeight);","                totalWidth += itemWidth + hSpacing;","                totalHeight += itemHeight + vSpacing;","                items.push(item);","            }","        }","        this._drawing = false;","        if(this._callLater)","        {","            this._drawLegend();","        }","        else","        {","            layout._positionLegendItems.apply(this, [items, maxWidth, maxHeight, totalWidth, totalHeight, padding, hSpacing, vSpacing, hAlign, vAlign]);","            this._updateBackground(styles);","            this.fire(\"legendRendered\");","        }","    },","","    /**","     * Updates the background for the legend.","     *","     * @method _updateBackground","     * @param {Object} styles Reference to the legend's styles attribute","     * @private","     */","    _updateBackground: function(styles)","    {","        var backgroundStyles = styles.background,","            contentRect = this._contentRect,","            padding = styles.padding,","            x = contentRect.left - padding.left,","            y = contentRect.top - padding.top,","            w = contentRect.right - x + padding.right,","            h = contentRect.bottom - y + padding.bottom;","        this.get(\"background\").set({","            fill: backgroundStyles.fill,","            stroke: backgroundStyles.border,","            width: w,","            height: h,","            x: x,","            y: y","        });","    },","","    /**","     * Retrieves the marker styles based on the type of series. For series that contain a marker, the marker styles are returned.","     * ","     * @method _getStylesBySeriesType","     * @param {CartesianSeries | PieSeries} The series in which the style properties will be received.","     * @return Object An object containing fill, border and shape information.","     * @private","     */","    _getStylesBySeriesType: function(series)","    {","        var styles = series.get(\"styles\"),","            color;","        if(series instanceof Y.LineSeries || series instanceof Y.StackedLineSeries)","        {","            styles = series.get(\"styles\").line;","            color = styles.color || series._getDefaultColor(series.get(\"graphOrder\"), \"line\");","            return {","                border: {","                    weight: 1,","                    color: color","                },","                fill: {","                    color: color","                }","            };","        }","        else if(series instanceof Y.AreaSeries || series instanceof Y.StackedAreaSeries)","        {","            styles = series.get(\"styles\").area;","            color = styles.color || series._getDefaultColor(series.get(\"graphOrder\"), \"slice\");","            return {","                border: {","                    weight: 1,","                    color: color","                },","                fill: {","                    color: color","                }","            };","        }","        else ","        {","            styles = series.get(\"styles\").marker;","            return {","                fill: styles.fill,","","                border: {","                    weight: styles.border.weight,","","                    color: styles.border.color,","","                    shape: styles.shape","                },","                shape: styles.shape","            };","        }","    },","","    /**","     * Returns a legend item consisting of the following properties:","     *  <dl>","     *    <dt>node</dt><dd>The `Node` containing the legend item elements.</dd>","     *      <dt>shape</dt><dd>The `Shape` element for the legend item.</dd>","     *      <dt>textNode</dt><dd>The `Node` containing the text></dd>","     *      <dt>text</dt><dd></dd>","     *  </dl>","     *","     * @method _getLegendItem","     * @param {Node} shapeProps Reference to the `node` attribute.","     * @param {String | Class} shapeClass The type of shape","     * @param {Object} fill Properties for the shape's fill","     * @param {Object} border Properties for the shape's border","     * @param {String} text String to be rendered as the legend's text","     * @param {Number} width Total width of the legend item","     * @param {Number} height Total height of the legend item","     * @param {HTML | String} text Text for the legendItem","     * @return Object","     * @private","     */","    _getLegendItem: function(node, shapeClass, fill, border, labelStyles, w, h, text) ","    {","        var containerNode = Y.one(DOCUMENT.createElement(\"div\")),","            textField = Y.one(DOCUMENT.createElement(\"span\")),","            shape,","            dimension,","            padding,","            left,","            item;","        containerNode.setStyle(POSITION, \"absolute\");","        textField.setStyle(POSITION, \"absolute\");","        textField.setStyles(labelStyles);","        textField.appendChild(DOCUMENT.createTextNode(text));","        containerNode.appendChild(textField);","        node.appendChild(containerNode);","        dimension = textField.get(\"offsetHeight\");","        padding = dimension - h;","        left = w + padding + 2;","        textField.setStyle(\"left\", left + PX);","        containerNode.setStyle(\"height\", dimension + PX);","        containerNode.setStyle(\"width\", (left + textField.get(\"offsetWidth\")) + PX);","        shape = new shapeClass({","            fill: fill,","            stroke: border,","            width: w,","            height: h,","            x: padding * 0.5,","            y: padding * 0.5,","            w: w,","            h: h,","            graphic: containerNode","        });","        textField.setStyle(\"left\", dimension + PX);","        item = {","            node: containerNode,","            width: containerNode.get(\"offsetWidth\"),","            height: containerNode.get(\"offsetHeight\"),","            shape: shape,","            textNode: textField,","            text: text","        };","        this._items.push(item);","        return item;","    },","","    /**","     * Evaluates and returns correct class for drawing a shape.","     *","     * @method _getShapeClass","     * @return Shape","     * @private","     */","    _getShapeClass: function()","    {   ","        var graphic = this.get(\"background\").get(\"graphic\");","        return graphic._getShapeClass.apply(graphic, arguments);","    },","    ","    /**","     * Returns the default hash for the `styles` attribute.","     *","     * @method _getDefaultStyles","     * @return Object","     * @protected","     */","    _getDefaultStyles: function()","    {","        var styles = { ","            padding: {","                top: 8,","                right: 8,","                bottom: 8,","                left: 9","            },","            gap: 10,","            hAlign: \"center\",","            vAlign: \"top\",","            marker: this._getPlotDefaults(),","            item: {","                hSpacing: 10,","                vSpacing: 5,","                label: {","                    color:\"#808080\",","                    fontSize:\"85%\",","                    whiteSpace: \"nowrap\"","                }","            },","            background: {","                shape: \"rect\",","                fill:{","                    color:\"#faf9f2\"","                },","                border: {","                    color:\"#dad8c9\",","                    weight: 1","                }","            }","        };","        return styles;","    },","","    /**","     * Gets the default values for series that use the utility. This method is used by","     * the class' `styles` attribute's getter to get build default values.","     *","     * @method _getPlotDefaults","     * @return Object","     * @protected","     */","    _getPlotDefaults: function()","    {","        var defs = {","            width: 10,","            height: 10","        };","        return defs;","    },","","    /**","     * Destroys legend items.","     *","     * @method _destroyLegendItems","     * @private","     */","    _destroyLegendItems: function()","    {","        var item;","        if(this._items)","        {","            while(this._items.length > 0)","            {","                item = this._items.shift();","                item.shape.get(\"graphic\").destroy();","                item.node.empty();","                item.node.destroy(true);","                item.node = null;","                item = null;","            }","        }","        this._items = [];","    },","","    /**","     * Maps layout classes.","     *","     * @property _layout","     * @private","     */","    _layout: {","        vertical: VerticalLegendLayout,","        horizontal: HorizontalLegendLayout","    },","","    /**","     * Destructor implementation ChartLegend class. Removes all items and the Graphic instance from the widget.","     *","     * @method destructor","     * @protected","     */","    destructor: function()","    {","        var background = this.get(\"background\"),","            backgroundGraphic;","        this._destroyLegendItems();","        if(background)","        {","            backgroundGraphic = background.get(\"graphic\");","            if(backgroundGraphic)","            {","                backgroundGraphic.destroy();","            }","            else","            {","                background.destroy();","            }","        }","","    }","}, {","    ATTRS: {","        /**","         * Indicates whether the chart's contentBox is the parentNode for the legend.","         *","         * @attribute includeInChartLayout","         * @type Boolean","         * @private","         */","        includeInChartLayout: {","            value: false","        },","","        /**","         * Reference to the `Chart` instance.","         *","         * @attribute chart","         * @type Chart","         */","        chart: {","            setter: function(val)","            {","                this.after(\"legendRendered\", Y.bind(val._itemRendered, val));","                return val;","            }","        },","","        /**","         * Indicates the direction in relation of the legend's layout. The `direction` of the legend is determined by its","         * `position` value.","         *","         * @attribute direction","         * @type String","         */","        direction: {","            value: \"vertical\"","        },","       ","        /**","         * Indicates the position and direction of the legend. Possible values are `left`, `top`, `right` and `bottom`. Values of `left` and","         * `right` values have a `direction` of `vertical`. Values of `top` and `bottom` values have a `direction` of `horizontal`.","         *","         * @attribute position","         * @type String","         */","        position: {","            lazyAdd: false,","","            value: \"right\",","","            setter: function(val)","            {","                if(val == TOP || val == BOTTOM)","                {","                    this.set(\"direction\", HORIZONTAL);","                }","                else if(val == LEFT || val == RIGHT)","                {","                    this.set(\"direction\", VERTICAL);","                }","                return val;","            }","        },"," ","        /**","         * The width of the legend. Depending on the implementation of the ChartLegend, this value is `readOnly`. By default, the legend is included in the layout of the `Chart` that ","         * it references. Under this circumstance, `width` is always `readOnly`. When the legend is rendered in its own dom element, the `readOnly` status is determined by the ","         * direction of the legend. If the `position` is `left` or `right` or the `direction` is `vertical`, width is `readOnly`. If the position is `top` or `bottom` or the `direction`","         * is `horizontal`, width can be explicitly set. If width is not explicitly set, the width will be determined by the width of the legend's parent element.","         *","         * @attribute width","         * @type Number","         */","        width: {","            getter: function()","            {","                var chart = this.get(\"chart\"),","                    parentNode = this._parentNode;","                if(parentNode)","                {","                    if((chart && this.get(\"includeInChartLayout\")) || this._width)","                    {","                        if(!this._width)","                        {","                            this._width = 0;","                        }","                        return this._width;","                    }","                    else","                    {","                        return parentNode.get(\"offsetWidth\");","                    }","                }","                return \"\";","            },","","            setter: function(val)","            {","                this._width = val;","                return val;","            }","        },","","        /**","         * The height of the legend. Depending on the implementation of the ChartLegend, this value is `readOnly`. By default, the legend is included in the layout of the `Chart` that ","         * it references. Under this circumstance, `height` is always `readOnly`. When the legend is rendered in its own dom element, the `readOnly` status is determined by the ","         * direction of the legend. If the `position` is `top` or `bottom` or the `direction` is `horizontal`, height is `readOnly`. If the position is `left` or `right` or the `direction`","         * is `vertical`, height can be explicitly set. If height is not explicitly set, the height will be determined by the width of the legend's parent element.","         *","         * @attribute height ","         * @type Number","         */","        height: {","            valueFn: \"_heightGetter\",","","            getter: function()","            {","                var chart = this.get(\"chart\"),","                    parentNode = this._parentNode;","                if(parentNode) ","                {","                    if((chart && this.get(\"includeInChartLayout\")) || this._height)","                    {","                        if(!this._height)","                        {","                            this._height = 0;","                        }","                        return this._height;","                    }","                    else","                    {","                        return parentNode.get(\"offsetHeight\");","                    }","                }","                return \"\";","            },","","            setter: function(val)","            {","                this._height = val;","                return val;","            }","        },","","        /**","         * Indicates the x position of legend.","         *","         * @attribute x","         * @type Number","         * @readOnly","         */","        x: {","            lazyAdd: false,","","            value: 0,","            ","            setter: function(val)","            {","                var node = this.get(\"boundingBox\");","                if(node)","                {","                    node.setStyle(LEFT, val + PX);","                }","                return val;","            }","        },","","        /**","         * Indicates the y position of legend.","         *","         * @attribute y","         * @type Number","         * @readOnly","         */","        y: {","            lazyAdd: false,","","            value: 0,","            ","            setter: function(val)","            {","                var node = this.get(\"boundingBox\");","                if(node)","                {","                    node.setStyle(TOP, val + PX);","                }","                return val;","            }","        },","","        /**","         * Array of items contained in the legend. Each item is an object containing the following properties:","         *","         * <dl>","         *      <dt>node</dt><dd>Node containing text for the legend item.</dd>","         *      <dt>marker</dt><dd>Shape for the legend item.</dd>","         * </dl>","         *","         * @attribute items","         * @type Array","         * @readOnly","         */","        items: {","            getter: function()","            {","                return this._items;","            }","        },","","        /**","         * Background for the legend.","         *","         * @attribute background","         * @type Rect","         */","        background: {}","","        /**","         * Properties used to display and style the ChartLegend.  This attribute is inherited from `Renderer`. Below are the default values:","         *","         *  <dl>","         *      <dt>gap</dt><dd>Distance, in pixels, between the `ChartLegend` instance and the chart's content. When `ChartLegend` is rendered within a `Chart` instance this value is applied.</dd>","         *      <dt>hAlign</dt><dd>Defines the horizontal alignment of the `items` in a `ChartLegend` rendered in a horizontal direction. This value is applied when the instance's `position` is set to top or bottom. This attribute can be set to left, center or right. The default value is center.</dd>","         *      <dt>vAlign</dt><dd>Defines the vertical alignment of the `items` in a `ChartLegend` rendered in vertical direction. This value is applied when the instance's `position` is set to left or right. The attribute can be set to top, middle or bottom. The default value is middle.</dd>","         *      <dt>item</dt><dd>Set of style properties applied to the `items` of the `ChartLegend`.","         *          <dl>","         *              <dt>hSpacing</dt><dd>Horizontal distance, in pixels, between legend `items`.</dd>","         *              <dt>vSpacing</dt><dd>Vertical distance, in pixels, between legend `items`.</dd>","         *              <dt>label</dt><dd>Properties for the text of an `item`.","         *                  <dl>","         *                      <dt>color</dt><dd>Color of the text. The default values is \"#808080\".</dd>","         *                      <dt>fontSize</dt><dd>Font size for the text. The default value is \"85%\".</dd>","         *                  </dl>","         *              </dd>","         *              <dt>marker</dt><dd>Properties for the `item` markers.","         *                  <dl>","         *                      <dt>width</dt><dd>Specifies the width of the markers.</dd>","         *                      <dt>height</dt><dd>Specifies the height of the markers.</dd>","         *                  </dl>","         *              </dd>","         *          </dl>","         *      </dd>","         *      <dt>background</dt><dd>Properties for the `ChartLegend` background.","         *          <dl>","         *              <dt>fill</dt><dd>Properties for the background fill.","         *                  <dl>","         *                      <dt>color</dt><dd>Color for the fill. The default value is \"#faf9f2\".</dd>","         *                  </dl>","         *              </dd>","         *              <dt>border</dt><dd>Properties for the background border.","         *                  <dl>","         *                      <dt>color</dt><dd>Color for the border. The default value is \"#dad8c9\".</dd>","         *                      <dt>weight</dt><dd>Weight of the border. The default values is 1.</dd>","         *                  </dl>","         *              </dd>","         *          </dl>","         *      </dd>","         * </dl>","         *","         * @attribute styles","         * @type Object","         */","    }","});","/**"," * The Chart class is the basic application used to create a chart."," *"," * @module charts"," * @class Chart"," * @constructor"," */","function Chart(cfg)","{","    if(cfg.type != \"pie\")","    {","        return new Y.CartesianChart(cfg);","    }","    else","    {","        return new Y.PieChart(cfg);","    }","}","Y.Chart = Chart;","","","}, '3.7.3', {\"requires\": [\"charts-base\"]});"];
_yuitest_coverage["build/charts-legend/charts-legend.js"].lines = {"1":0,"9":0,"26":0,"27":0,"29":0,"31":0,"33":0,"34":0,"38":0,"39":0,"41":0,"42":0,"44":0,"46":0,"76":0,"95":0,"96":0,"97":0,"98":0,"99":0,"101":0,"102":0,"103":0,"104":0,"105":0,"107":0,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"119":0,"121":0,"123":0,"129":0,"131":0,"147":0,"155":0,"157":0,"158":0,"159":0,"161":0,"162":0,"166":0,"167":0,"169":0,"171":0,"173":0,"175":0,"176":0,"192":0,"193":0,"196":0,"197":0,"199":0,"200":0,"202":0,"203":0,"205":0,"235":0,"255":0,"256":0,"257":0,"258":0,"259":0,"261":0,"262":0,"263":0,"264":0,"265":0,"266":0,"268":0,"269":0,"270":0,"271":0,"272":0,"273":0,"274":0,"275":0,"276":0,"277":0,"278":0,"279":0,"280":0,"281":0,"283":0,"285":0,"291":0,"293":0,"309":0,"317":0,"319":0,"320":0,"321":0,"323":0,"324":0,"328":0,"329":0,"331":0,"333":0,"335":0,"337":0,"338":0,"354":0,"355":0,"358":0,"359":0,"361":0,"362":0,"364":0,"365":0,"367":0,"380":0,"382":0,"383":0,"385":0,"386":0,"387":0,"420":0,"422":0,"423":0,"424":0,"426":0,"427":0,"430":0,"432":0,"433":0,"434":0,"435":0,"437":0,"438":0,"441":0,"443":0,"444":0,"445":0,"447":0,"448":0,"451":0,"453":0,"454":0,"455":0,"457":0,"458":0,"462":0,"463":0,"464":0,"465":0,"466":0,"467":0,"468":0,"470":0,"471":0,"472":0,"473":0,"475":0,"476":0,"478":0,"479":0,"481":0,"482":0,"483":0,"485":0,"490":0,"491":0,"493":0,"494":0,"496":0,"497":0,"498":0,"500":0,"505":0,"506":0,"508":0,"509":0,"511":0,"512":0,"513":0,"515":0,"520":0,"521":0,"523":0,"524":0,"526":0,"527":0,"528":0,"530":0,"535":0,"536":0,"537":0,"538":0,"539":0,"541":0,"543":0,"546":0,"547":0,"548":0,"550":0,"551":0,"552":0,"554":0,"555":0,"556":0,"558":0,"559":0,"560":0,"564":0,"566":0,"567":0,"568":0,"570":0,"571":0,"573":0,"575":0,"576":0,"578":0,"580":0,"583":0,"585":0,"586":0,"587":0,"589":0,"590":0,"592":0,"594":0,"595":0,"597":0,"599":0,"602":0,"604":0,"605":0,"606":0,"608":0,"609":0,"610":0,"611":0,"613":0,"616":0,"618":0,"621":0,"623":0,"624":0,"625":0,"627":0,"628":0,"629":0,"630":0,"632":0,"635":0,"637":0,"640":0,"641":0,"643":0,"644":0,"646":0,"648":0,"649":0,"650":0,"651":0,"652":0,"655":0,"657":0,"658":0,"659":0,"660":0,"674":0,"688":0,"690":0,"691":0,"692":0,"694":0,"695":0,"696":0,"697":0,"698":0,"701":0,"702":0,"704":0,"705":0,"707":0,"708":0,"710":0,"711":0,"715":0,"727":0,"728":0,"730":0,"739":0,"741":0,"750":0,"752":0,"753":0,"755":0,"756":0,"757":0,"773":0,"775":0,"777":0,"778":0,"779":0,"780":0,"781":0,"782":0,"783":0,"785":0,"787":0,"790":0,"791":0,"792":0,"793":0,"794":0,"796":0,"797":0,"798":0,"799":0,"800":0,"802":0,"803":0,"804":0,"805":0,"806":0,"808":0,"809":0,"810":0,"811":0,"812":0,"814":0,"815":0,"819":0,"822":0,"823":0,"825":0,"826":0,"828":0,"829":0,"831":0,"832":0,"838":0,"839":0,"840":0,"841":0,"844":0,"845":0,"847":0,"848":0,"850":0,"852":0,"853":0,"855":0,"857":0,"858":0,"872":0,"881":0,"890":0,"899":0,"907":0,"908":0,"909":0,"918":0,"919":0,"920":0,"921":0,"922":0,"931":0,"933":0,"935":0,"948":0,"950":0,"963":0,"965":0,"967":0,"969":0,"971":0,"984":0,"988":0,"990":0,"1002":0,"1004":0,"1005":0,"1007":0,"1008":0,"1009":0,"1011":0,"1013":0,"1049":0,"1051":0,"1053":0,"1054":0,"1056":0,"1057":0,"1058":0,"1059":0,"1060":0,"1061":0,"1062":0,"1063":0,"1064":0,"1065":0,"1066":0,"1068":0,"1069":0,"1072":0,"1076":0,"1077":0,"1078":0,"1079":0,"1080":0,"1081":0,"1082":0,"1083":0,"1084":0,"1089":0,"1090":0,"1091":0,"1093":0,"1094":0,"1095":0,"1097":0,"1098":0,"1100":0,"1103":0,"1104":0,"1105":0,"1106":0,"1107":0,"1108":0,"1109":0,"1110":0,"1111":0,"1114":0,"1115":0,"1117":0,"1121":0,"1122":0,"1123":0,"1136":0,"1143":0,"1163":0,"1165":0,"1167":0,"1168":0,"1169":0,"1179":0,"1181":0,"1182":0,"1183":0,"1195":0,"1196":0,"1234":0,"1241":0,"1242":0,"1243":0,"1244":0,"1245":0,"1246":0,"1247":0,"1248":0,"1249":0,"1250":0,"1251":0,"1252":0,"1253":0,"1264":0,"1265":0,"1273":0,"1274":0,"1286":0,"1287":0,"1299":0,"1330":0,"1343":0,"1347":0,"1358":0,"1359":0,"1361":0,"1363":0,"1364":0,"1365":0,"1366":0,"1367":0,"1368":0,"1371":0,"1393":0,"1395":0,"1396":0,"1398":0,"1399":0,"1401":0,"1405":0,"1432":0,"1433":0,"1462":0,"1464":0,"1466":0,"1468":0,"1470":0,"1486":0,"1488":0,"1490":0,"1492":0,"1494":0,"1496":0,"1500":0,"1503":0,"1508":0,"1509":0,"1527":0,"1529":0,"1531":0,"1533":0,"1535":0,"1537":0,"1541":0,"1544":0,"1549":0,"1550":0,"1568":0,"1569":0,"1571":0,"1573":0,"1591":0,"1592":0,"1594":0,"1596":0,"1615":0,"1681":0,"1683":0,"1685":0,"1689":0,"1692":0};
_yuitest_coverage["build/charts-legend/charts-legend.js"].functions = {"setter:24":0,"_positionLegendItems:74":0,"_setRowArrays:145":0,"getStartPoint:190":0,"_positionLegendItems:233":0,"_setColumnArrays:307":0,"getStartPoint:352":0,"_redraw:378":0,"_getLayoutBoxDimensions:672":0,"destructor:725":0,"_redraw:748":0,"initializer:888":0,"renderUI:897":0,"bindUI:916":0,"syncUI:929":0,"_updateHandler:946":0,"_positionChangeHandler:961":0,"_handleSizeChange:982":0,"_drawLegend:1000":0,"_updateBackground:1134":0,"_getStylesBySeriesType:1161":0,"_getLegendItem:1232":0,"_getShapeClass:1284":0,"_getDefaultStyles:1297":0,"_getPlotDefaults:1341":0,"_destroyLegendItems:1356":0,"destructor:1391":0,"setter:1430":0,"setter:1460":0,"getter:1484":0,"setter:1506":0,"getter:1525":0,"setter:1547":0,"setter:1566":0,"setter:1589":0,"getter:1613":0,"Chart:1681":0,"(anonymous 1):1":0};
_yuitest_coverage["build/charts-legend/charts-legend.js"].coveredLines = 535;
_yuitest_coverage["build/charts-legend/charts-legend.js"].coveredFunctions = 38;
_yuitest_coverline("build/charts-legend/charts-legend.js", 1);
YUI.add('charts-legend', function (Y, NAME) {

/**
 * Adds legend functionality to charts.
 *
 * @module charts
 * @submodule charts-legend
 */
_yuitest_coverfunc("build/charts-legend/charts-legend.js", "(anonymous 1)", 1);
_yuitest_coverline("build/charts-legend/charts-legend.js", 9);
var DOCUMENT = Y.config.doc, 
TOP = "top",
RIGHT = "right",
BOTTOM = "bottom",
LEFT = "left",
EXTERNAL = "external",
HORIZONTAL = "horizontal",
VERTICAL = "vertical",
WIDTH = "width",
HEIGHT = "height",
POSITION = "position",
_X = "x",
_Y = "y",
PX = "px",
LEGEND = {
    setter: function(val)
    {   
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "setter", 24);
_yuitest_coverline("build/charts-legend/charts-legend.js", 26);
var legend = this.get("legend");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 27);
if(legend)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 29);
legend.destroy(true);
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 31);
if(val instanceof Y.ChartLegend)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 33);
legend = val;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 34);
legend.set("chart", this);
        }
        else
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 38);
val.chart = this;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 39);
if(!val.hasOwnProperty("render"))
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 41);
val.render = this.get("contentBox");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 42);
val.includeInChartLayout = true;
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 44);
legend = new Y.ChartLegend(val);
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 46);
return legend;
    }
},

/**
 * Contains methods for displaying items horizontally in a legend.
 *
 * @module charts
 * @submodule charts-legend
 * @class HorizontalLegendLayout
 */
HorizontalLegendLayout = {
    /**
     * Displays items horizontally in a legend.
     *
     * @method _positionLegendItems
     * @param {Array} items Array of items to display in the legend.
     * @param {Number} maxWidth The width of the largest item in the legend.
     * @param {Number} maxHeight The height of the largest item in the legend.
     * @param {Number} totalWidth The total width of all items in a legend.
     * @param {Number} totalHeight The total height of all items in a legend.
     * @param {Number} padding The left, top, right and bottom padding properties for the legend.
     * @param {Number} horizontalGap The horizontal distance between items in a legend.
     * @param {Number} verticalGap The vertical distance between items in a legend.
     * @param {String} hAlign The horizontal alignment of the legend.
     * @param {String} vAlign The vertical alignment of the legend.
     * @protected
     */
    _positionLegendItems: function(items, maxWidth, maxHeight, totalWidth, totalHeight, padding, horizontalGap, verticalGap, hAlign, vAlign)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_positionLegendItems", 74);
_yuitest_coverline("build/charts-legend/charts-legend.js", 76);
var i = 0,
            rowIterator = 0,
            item,
            node,
            itemWidth,
            itemHeight,
            len,
            width = this.get("width"),
            rows,
            rowsLen,
            row,
            totalWidthArray,
            legendWidth,
            topHeight = padding.top - verticalGap,
            limit = width - (padding.left + padding.right),
            left, 
            top,
            right,
            bottom;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 95);
HorizontalLegendLayout._setRowArrays(items, limit, horizontalGap);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 96);
rows = HorizontalLegendLayout.rowArray;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 97);
totalWidthArray = HorizontalLegendLayout.totalWidthArray;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 98);
rowsLen = rows.length;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 99);
for(; rowIterator < rowsLen; ++ rowIterator)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 101);
topHeight += verticalGap;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 102);
row = rows[rowIterator];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 103);
len = row.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 104);
legendWidth =  HorizontalLegendLayout.getStartPoint(width, totalWidthArray[rowIterator], hAlign, padding);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 105);
for(i = 0; i < len; ++i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 107);
item = row[i];
                _yuitest_coverline("build/charts-legend/charts-legend.js", 108);
node = item.node;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 109);
itemWidth = item.width;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 110);
itemHeight = item.height;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 111);
item.x = legendWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 112);
item.y = 0;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 113);
left = !isNaN(left) ? Math.min(left, legendWidth) : legendWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 114);
top = !isNaN(top) ? Math.min(top, topHeight) : topHeight;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 115);
right = !isNaN(right) ? Math.max(legendWidth + itemWidth, right) : legendWidth + itemWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 116);
bottom = !isNaN(bottom) ? Math.max(topHeight + itemHeight, bottom) : topHeight + itemHeight;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 117);
node.setStyle("left", legendWidth + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 118);
node.setStyle("top", topHeight + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 119);
legendWidth += itemWidth + horizontalGap;
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 121);
topHeight += item.height;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 123);
this._contentRect = {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
        _yuitest_coverline("build/charts-legend/charts-legend.js", 129);
if(this.get("includeInChartLayout"))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 131);
this.set("height", topHeight + padding.bottom);
        }
    },

    /**
     * Creates row and total width arrays used for displaying multiple rows of
     * legend items based on the items, available width and horizontalGap for the legend.
     *
     * @method _setRowArrays
     * @param {Array} items Array of legend items to display in a legend.
     * @param {Number} limit Total available width for displaying items in a legend.
     * @param {Number} horizontalGap Horizontal distance between items in a legend.
     * @protected
     */
    _setRowArrays: function(items, limit, horizontalGap)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_setRowArrays", 145);
_yuitest_coverline("build/charts-legend/charts-legend.js", 147);
var item = items[0],
            rowArray = [[item]],
            i = 1,
            rowIterator = 0,
            len = items.length,
            totalWidth = item.width,
            itemWidth,
            totalWidthArray = [[totalWidth]];
        _yuitest_coverline("build/charts-legend/charts-legend.js", 155);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 157);
item = items[i];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 158);
itemWidth = item.width;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 159);
if((totalWidth + horizontalGap + itemWidth) <= limit)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 161);
totalWidth += horizontalGap + itemWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 162);
rowArray[rowIterator].push(item);
            }
            else
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 166);
totalWidth = horizontalGap + itemWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 167);
if(rowArray[rowIterator])
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 169);
rowIterator += 1;
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 171);
rowArray[rowIterator] = [item];
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 173);
totalWidthArray[rowIterator] = totalWidth;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 175);
HorizontalLegendLayout.rowArray = rowArray;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 176);
HorizontalLegendLayout.totalWidthArray = totalWidthArray;
    },

    /**
     * Returns the starting x-coordinate for a row of legend items.
     *
     * @method getStartPoint
     * @param {Number} w Width of the legend.
     * @param {Number} totalWidth Total width of all labels in the row.
     * @param {String} align Horizontal alignment of items for the legend.
     * @param {Object} padding Object contain left, top, right and bottom padding properties.
     * @return Number
     * @protected
     */
    getStartPoint: function(w, totalWidth, align, padding)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "getStartPoint", 190);
_yuitest_coverline("build/charts-legend/charts-legend.js", 192);
var startPoint;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 193);
switch(align)
        {
            case LEFT :
                _yuitest_coverline("build/charts-legend/charts-legend.js", 196);
startPoint = padding.left;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 197);
break;
            case "center" :
                _yuitest_coverline("build/charts-legend/charts-legend.js", 199);
startPoint = (w - totalWidth) * 0.5;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 200);
break;
            case RIGHT :
                _yuitest_coverline("build/charts-legend/charts-legend.js", 202);
startPoint = w - totalWidth - padding.right;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 203);
break;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 205);
return startPoint;
    }
},

/**
 * Contains methods for displaying items vertically in a legend.
 *
 * @module charts
 * @submodule charts-legend
 * @class VerticalLegendLayout
 */
VerticalLegendLayout = {
    /**
     * Displays items vertically in a legend.
     *
     * @method _positionLegendItems
     * @param {Array} items Array of items to display in the legend.
     * @param {Number} maxWidth The width of the largest item in the legend.
     * @param {Number} maxHeight The height of the largest item in the legend.
     * @param {Number} totalWidth The total width of all items in a legend.
     * @param {Number} totalHeight The total height of all items in a legend.
     * @param {Number} padding The left, top, right and bottom padding properties for the legend.
     * @param {Number} horizontalGap The horizontal distance between items in a legend.
     * @param {Number} verticalGap The vertical distance between items in a legend.
     * @param {String} hAlign The horizontal alignment of the legend.
     * @param {String} vAlign The vertical alignment of the legend.
     * @protected
     */
    _positionLegendItems: function(items, maxWidth, maxHeight, totalWidth, totalHeight, padding, horizontalGap, verticalGap, hAlign, vAlign)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_positionLegendItems", 233);
_yuitest_coverline("build/charts-legend/charts-legend.js", 235);
var i = 0,
            columnIterator = 0,
            item,
            node,
            itemHeight,
            itemWidth,
            len,
            height = this.get("height"),
            columns,
            columnsLen,
            column,
            totalHeightArray,
            legendHeight,
            leftWidth = padding.left - horizontalGap,
            legendWidth,
            limit = height - (padding.top + padding.bottom),
            left, 
            top,
            right,
            bottom;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 255);
VerticalLegendLayout._setColumnArrays(items, limit, verticalGap);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 256);
columns = VerticalLegendLayout.columnArray;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 257);
totalHeightArray = VerticalLegendLayout.totalHeightArray;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 258);
columnsLen = columns.length;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 259);
for(; columnIterator < columnsLen; ++ columnIterator)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 261);
leftWidth += horizontalGap;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 262);
column = columns[columnIterator];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 263);
len = column.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 264);
legendHeight =  VerticalLegendLayout.getStartPoint(height, totalHeightArray[columnIterator], vAlign, padding);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 265);
legendWidth = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 266);
for(i = 0; i < len; ++i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 268);
item = column[i];
                _yuitest_coverline("build/charts-legend/charts-legend.js", 269);
node = item.node;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 270);
itemHeight = item.height;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 271);
itemWidth = item.width;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 272);
item.y = legendHeight;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 273);
item.x = leftWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 274);
left = !isNaN(left) ? Math.min(left, leftWidth) : leftWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 275);
top = !isNaN(top) ? Math.min(top, legendHeight) : legendHeight;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 276);
right = !isNaN(right) ? Math.max(leftWidth + itemWidth, right) : leftWidth + itemWidth;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 277);
bottom = !isNaN(bottom) ? Math.max(legendHeight + itemHeight, bottom) : legendHeight + itemHeight;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 278);
node.setStyle("left", leftWidth + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 279);
node.setStyle("top", legendHeight + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 280);
legendHeight += itemHeight + verticalGap;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 281);
legendWidth = Math.max(legendWidth, item.width);
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 283);
leftWidth += legendWidth;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 285);
this._contentRect = {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
        _yuitest_coverline("build/charts-legend/charts-legend.js", 291);
if(this.get("includeInChartLayout"))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 293);
this.set("width", leftWidth + padding.right);
        }
    },

    /**
     * Creates column and total height arrays used for displaying multiple columns of
     * legend items based on the items, available height and verticalGap for the legend.
     *
     * @method _setColumnArrays
     * @param {Array} items Array of legend items to display in a legend.
     * @param {Number} limit Total available height for displaying items in a legend.
     * @param {Number} verticalGap Vertical distance between items in a legend.
     * @protected
     */
    _setColumnArrays: function(items, limit, verticalGap)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_setColumnArrays", 307);
_yuitest_coverline("build/charts-legend/charts-legend.js", 309);
var item = items[0],
            columnArray = [[item]],
            i = 1,
            columnIterator = 0,
            len = items.length,
            totalHeight = item.height,
            itemHeight,
            totalHeightArray = [[totalHeight]];
        _yuitest_coverline("build/charts-legend/charts-legend.js", 317);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 319);
item = items[i];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 320);
itemHeight = item.height;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 321);
if((totalHeight + verticalGap + itemHeight) <= limit)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 323);
totalHeight += verticalGap + itemHeight;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 324);
columnArray[columnIterator].push(item);
            }
            else
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 328);
totalHeight = verticalGap + itemHeight;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 329);
if(columnArray[columnIterator])
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 331);
columnIterator += 1;
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 333);
columnArray[columnIterator] = [item];
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 335);
totalHeightArray[columnIterator] = totalHeight;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 337);
VerticalLegendLayout.columnArray = columnArray;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 338);
VerticalLegendLayout.totalHeightArray = totalHeightArray;
    },

    /**
     * Returns the starting y-coordinate for a column of legend items.
     *
     * @method getStartPoint
     * @param {Number} h Height of the legend.
     * @param {Number} totalHeight Total height of all labels in the column.
     * @param {String} align Vertical alignment of items for the legend.
     * @param {Object} padding Object contain left, top, right and bottom padding properties.
     * @return Number
     * @protected
     */
    getStartPoint: function(h, totalHeight, align, padding)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "getStartPoint", 352);
_yuitest_coverline("build/charts-legend/charts-legend.js", 354);
var startPoint;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 355);
switch(align)
        {
            case TOP :
                _yuitest_coverline("build/charts-legend/charts-legend.js", 358);
startPoint = padding.top;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 359);
break;
            case "middle" :
                _yuitest_coverline("build/charts-legend/charts-legend.js", 361);
startPoint = (h - totalHeight) * 0.5;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 362);
break;
            case BOTTOM :
                _yuitest_coverline("build/charts-legend/charts-legend.js", 364);
startPoint = h - totalHeight - padding.bottom;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 365);
break;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 367);
return startPoint;
    }
},

CartesianChartLegend = Y.Base.create("cartesianChartLegend", Y.CartesianChart, [], {
    /**
     * Redraws and position all the components of the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_redraw", 378);
_yuitest_coverline("build/charts-legend/charts-legend.js", 380);
if(this._drawing)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 382);
this._callLater = true;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 383);
return;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 385);
this._drawing = true;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 386);
this._callLater = false;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 387);
var w = this.get("width"),
            h = this.get("height"),
            layoutBoxDimensions = this._getLayoutBoxDimensions(),
            leftPaneWidth = layoutBoxDimensions.left,
            rightPaneWidth = layoutBoxDimensions.right,
            topPaneHeight = layoutBoxDimensions.top,
            bottomPaneHeight = layoutBoxDimensions.bottom,
            leftAxesCollection = this.get("leftAxesCollection"),
            rightAxesCollection = this.get("rightAxesCollection"),
            topAxesCollection = this.get("topAxesCollection"),
            bottomAxesCollection = this.get("bottomAxesCollection"),
            i = 0,
            l,
            axis,
            graphOverflow = "visible",
            graph = this.get("graph"),
            topOverflow,
            bottomOverflow,
            leftOverflow,
            rightOverflow,
            graphWidth,
            graphHeight,
            graphX,
            graphY,
            allowContentOverflow = this.get("allowContentOverflow"),
            diff,
            rightAxesXCoords,
            leftAxesXCoords,
            topAxesYCoords,
            bottomAxesYCoords,
            legend = this.get("legend"),
            graphRect = {};

        _yuitest_coverline("build/charts-legend/charts-legend.js", 420);
if(leftAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 422);
leftAxesXCoords = [];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 423);
l = leftAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 424);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 426);
leftAxesXCoords.unshift(leftPaneWidth);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 427);
leftPaneWidth += leftAxesCollection[i].get("width");
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 430);
if(rightAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 432);
rightAxesXCoords = [];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 433);
l = rightAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 434);
i = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 435);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 437);
rightPaneWidth += rightAxesCollection[i].get("width");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 438);
rightAxesXCoords.unshift(w - rightPaneWidth);
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 441);
if(topAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 443);
topAxesYCoords = [];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 444);
l = topAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 445);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 447);
topAxesYCoords.unshift(topPaneHeight);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 448);
topPaneHeight += topAxesCollection[i].get("height");
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 451);
if(bottomAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 453);
bottomAxesYCoords = [];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 454);
l = bottomAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 455);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 457);
bottomPaneHeight += bottomAxesCollection[i].get("height");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 458);
bottomAxesYCoords.unshift(h - bottomPaneHeight);
            }
        }
        
        _yuitest_coverline("build/charts-legend/charts-legend.js", 462);
graphWidth = w - (leftPaneWidth + rightPaneWidth);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 463);
graphHeight = h - (bottomPaneHeight + topPaneHeight);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 464);
graphRect.left = leftPaneWidth;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 465);
graphRect.top = topPaneHeight;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 466);
graphRect.bottom = h - bottomPaneHeight;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 467);
graphRect.right = w - rightPaneWidth;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 468);
if(!allowContentOverflow)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 470);
topOverflow = this._getTopOverflow(leftAxesCollection, rightAxesCollection);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 471);
bottomOverflow = this._getBottomOverflow(leftAxesCollection, rightAxesCollection);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 472);
leftOverflow = this._getLeftOverflow(bottomAxesCollection, topAxesCollection);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 473);
rightOverflow = this._getRightOverflow(bottomAxesCollection, topAxesCollection);
            
            _yuitest_coverline("build/charts-legend/charts-legend.js", 475);
diff = topOverflow - topPaneHeight;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 476);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 478);
graphRect.top = topOverflow;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 479);
if(topAxesYCoords)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 481);
i = 0;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 482);
l = topAxesYCoords.length;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 483);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 485);
topAxesYCoords[i] += diff;
                    }
                }
            }

            _yuitest_coverline("build/charts-legend/charts-legend.js", 490);
diff = bottomOverflow - bottomPaneHeight;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 491);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 493);
graphRect.bottom = h - bottomOverflow;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 494);
if(bottomAxesYCoords)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 496);
i = 0;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 497);
l = bottomAxesYCoords.length;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 498);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 500);
bottomAxesYCoords[i] -= diff;
                    }
                }
            }

            _yuitest_coverline("build/charts-legend/charts-legend.js", 505);
diff = leftOverflow - leftPaneWidth;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 506);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 508);
graphRect.left = leftOverflow;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 509);
if(leftAxesXCoords)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 511);
i = 0;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 512);
l = leftAxesXCoords.length;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 513);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 515);
leftAxesXCoords[i] += diff;
                    }
                }
            }

            _yuitest_coverline("build/charts-legend/charts-legend.js", 520);
diff = rightOverflow - rightPaneWidth;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 521);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 523);
graphRect.right = w - rightOverflow;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 524);
if(rightAxesXCoords)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 526);
i = 0;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 527);
l = rightAxesXCoords.length;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 528);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 530);
rightAxesXCoords[i] -= diff;
                    }
                }
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 535);
graphWidth = graphRect.right - graphRect.left;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 536);
graphHeight = graphRect.bottom - graphRect.top;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 537);
graphX = graphRect.left;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 538);
graphY = graphRect.top;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 539);
if(legend)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 541);
if(legend.get("includeInChartLayout"))
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 543);
switch(legend.get("position"))
                {
                    case "left" : 
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 546);
legend.set("y", graphY);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 547);
legend.set("height", graphHeight);
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 548);
break;
                    case "top" :
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 550);
legend.set("x", graphX);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 551);
legend.set("width", graphWidth);
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 552);
break;
                    case "bottom" : 
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 554);
legend.set("x", graphX);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 555);
legend.set("width", graphWidth);
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 556);
break;
                    case "right" :
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 558);
legend.set("y", graphY);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 559);
legend.set("height", graphHeight);
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 560);
break;
                }
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 564);
if(topAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 566);
l = topAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 567);
i = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 568);
for(; i < l; i++)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 570);
axis = topAxesCollection[i];
                _yuitest_coverline("build/charts-legend/charts-legend.js", 571);
if(axis.get("width") !== graphWidth)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 573);
axis.set("width", graphWidth);
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 575);
axis.get("boundingBox").setStyle("left", graphX + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 576);
axis.get("boundingBox").setStyle("top", topAxesYCoords[i] + PX);
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 578);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 580);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 583);
if(bottomAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 585);
l = bottomAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 586);
i = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 587);
for(; i < l; i++)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 589);
axis = bottomAxesCollection[i];
                _yuitest_coverline("build/charts-legend/charts-legend.js", 590);
if(axis.get("width") !== graphWidth)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 592);
axis.set("width", graphWidth);
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 594);
axis.get("boundingBox").setStyle("left", graphX + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 595);
axis.get("boundingBox").setStyle("top", bottomAxesYCoords[i] + PX);
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 597);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 599);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 602);
if(leftAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 604);
l = leftAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 605);
i = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 606);
for(; i < l; ++i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 608);
axis = leftAxesCollection[i];
                _yuitest_coverline("build/charts-legend/charts-legend.js", 609);
axis.get("boundingBox").setStyle("top", graphY + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 610);
axis.get("boundingBox").setStyle("left", leftAxesXCoords[i] + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 611);
if(axis.get("height") !== graphHeight)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 613);
axis.set("height", graphHeight);
                }
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 616);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 618);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 621);
if(rightAxesCollection)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 623);
l = rightAxesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 624);
i = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 625);
for(; i < l; ++i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 627);
axis = rightAxesCollection[i];
                _yuitest_coverline("build/charts-legend/charts-legend.js", 628);
axis.get("boundingBox").setStyle("top", graphY + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 629);
axis.get("boundingBox").setStyle("left", rightAxesXCoords[i] + PX);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 630);
if(axis.get("height") !== graphHeight)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 632);
axis.set("height", graphHeight);
                }
            }
            _yuitest_coverline("build/charts-legend/charts-legend.js", 635);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 637);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 640);
this._drawing = false;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 641);
if(this._callLater)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 643);
this._redraw();
            _yuitest_coverline("build/charts-legend/charts-legend.js", 644);
return;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 646);
if(graph)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 648);
graph.get("boundingBox").setStyle("left", graphX + PX);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 649);
graph.get("boundingBox").setStyle("top", graphY + PX);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 650);
graph.set("width", graphWidth);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 651);
graph.set("height", graphHeight);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 652);
graph.get("boundingBox").setStyle("overflow", graphOverflow);
        }

        _yuitest_coverline("build/charts-legend/charts-legend.js", 655);
if(this._overlay)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 657);
this._overlay.setStyle("left", graphX + PX);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 658);
this._overlay.setStyle("top", graphY + PX);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 659);
this._overlay.setStyle("width", graphWidth + PX);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 660);
this._overlay.setStyle("height", graphHeight + PX);
        }
    },

    /**
     * Positions the legend in a chart and returns the properties of the legend to be used in the 
     * chart's layout algorithm.
     *
     * @method _getLayoutDimensions
     * @return {Object} The left, top, right and bottom values for the legend.
     * @protected
     */
    _getLayoutBoxDimensions: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_getLayoutBoxDimensions", 672);
_yuitest_coverline("build/charts-legend/charts-legend.js", 674);
var box = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            legend = this.get("legend"),
            position,
            direction,
            dimension,
            size,
            w = this.get(WIDTH),
            h = this.get(HEIGHT),
            gap;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 688);
if(legend && legend.get("includeInChartLayout"))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 690);
gap = legend.get("styles").gap;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 691);
position = legend.get(POSITION);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 692);
if(position != EXTERNAL)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 694);
direction = legend.get("direction");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 695);
dimension = direction == HORIZONTAL ? HEIGHT : WIDTH;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 696);
size = legend.get(dimension);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 697);
box[position] = size + gap;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 698);
switch(position)
                {
                    case TOP :
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 701);
legend.set(_Y, 0); 
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 702);
break;
                    case BOTTOM : 
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 704);
legend.set(_Y, h - size); 
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 705);
break;
                    case RIGHT :
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 707);
legend.set(_X, w - size);
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 708);
break;
                    case LEFT: 
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 710);
legend.set(_X, 0);
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 711);
break;
                }
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 715);
return box;
    },

    /**
     * Destructor implementation for the CartesianChart class. Calls destroy on all axes, series, legend (if available) and the Graph instance.
     * Removes the tooltip and overlay HTML elements.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "destructor", 725);
_yuitest_coverline("build/charts-legend/charts-legend.js", 727);
var legend = this.get("legend");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 728);
if(legend)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 730);
legend.destroy(true);
        }
    }
}, {
    ATTRS: {
        legend: LEGEND
    }
});

_yuitest_coverline("build/charts-legend/charts-legend.js", 739);
Y.CartesianChart = CartesianChartLegend;

_yuitest_coverline("build/charts-legend/charts-legend.js", 741);
var PieChartLegend = Y.Base.create("pieChartLegend", Y.PieChart, [], {
    /**
     * Redraws the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_redraw", 748);
_yuitest_coverline("build/charts-legend/charts-legend.js", 750);
if(this._drawing)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 752);
this._callLater = true;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 753);
return;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 755);
this._drawing = true;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 756);
this._callLater = false;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 757);
var graph = this.get("graph"),
            w = this.get("width"),
            h = this.get("height"),
            graphWidth,
            graphHeight,
            legend = this.get("legend"),
            x = 0,
            y = 0,
            legendX = 0,
            legendY = 0,
            legendWidth,
            legendHeight,
            dimension,
            gap,
            position,
            direction;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 773);
if(graph)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 775);
if(legend)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 777);
position = legend.get("position");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 778);
direction = legend.get("direction");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 779);
graphWidth = graph.get("width");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 780);
graphHeight = graph.get("height");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 781);
legendWidth = legend.get("width");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 782);
legendHeight = legend.get("height");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 783);
gap = legend.get("styles").gap;
                
                _yuitest_coverline("build/charts-legend/charts-legend.js", 785);
if((direction == "vertical" && (graphWidth + legendWidth + gap !== w)) || (direction == "horizontal" &&  (graphHeight + legendHeight + gap !== h)))
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 787);
switch(legend.get("position"))
                    {
                        case LEFT :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 790);
dimension = Math.min(w - (legendWidth + gap), h);
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 791);
legendHeight = h;
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 792);
x = legendWidth + gap;
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 793);
legend.set(HEIGHT, legendHeight);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 794);
break;
                        case TOP :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 796);
dimension = Math.min(h - (legendHeight + gap), w); 
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 797);
legendWidth = w;
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 798);
y = legendHeight + gap;
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 799);
legend.set(WIDTH, legendWidth);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 800);
break;
                        case RIGHT :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 802);
dimension = Math.min(w - (legendWidth + gap), h);
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 803);
legendHeight = h;
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 804);
legendX = dimension + gap;
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 805);
legend.set(HEIGHT, legendHeight);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 806);
break;
                        case BOTTOM :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 808);
dimension = Math.min(h - (legendHeight + gap), w); 
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 809);
legendWidth = w;
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 810);
legendY = dimension + gap; 
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 811);
legend.set(WIDTH, legendWidth);
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 812);
break;
                    }
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 814);
graph.set(WIDTH, dimension);
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 815);
graph.set(HEIGHT, dimension);
                }
                else
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 819);
switch(legend.get("position"))
                    {   
                        case LEFT :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 822);
x = legendWidth + gap;
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 823);
break;
                        case TOP :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 825);
y = legendHeight + gap;
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 826);
break;
                        case RIGHT :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 828);
legendX = graphWidth + gap;
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 829);
break;
                        case BOTTOM :
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 831);
legendY = graphHeight + gap; 
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 832);
break;
                    }
                }
            }
            else
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 838);
graph.set(_X, 0);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 839);
graph.set(_Y, 0);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 840);
graph.set(WIDTH, w);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 841);
graph.set(HEIGHT, h);
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 844);
this._drawing = false;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 845);
if(this._callLater)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 847);
this._redraw();
            _yuitest_coverline("build/charts-legend/charts-legend.js", 848);
return;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 850);
if(graph)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 852);
graph.set(_X, x);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 853);
graph.set(_Y, y);
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 855);
if(legend)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 857);
legend.set(_X, legendX);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 858);
legend.set(_Y, legendY);
        }
    }
}, {
    ATTRS: {
        /**
         * The legend for the chart.
         *
         * @attribute
         * @type Legend
         */
        legend: LEGEND
    }
});
_yuitest_coverline("build/charts-legend/charts-legend.js", 872);
Y.PieChart = PieChartLegend;
/**
 * ChartLegend provides a legend for a chart.
 *
 * @class ChartLegend
 * @module charts
 * @submodule charts-legend
 * @extends Widget
 */
_yuitest_coverline("build/charts-legend/charts-legend.js", 881);
Y.ChartLegend = Y.Base.create("chartlegend", Y.Widget, [Y.Renderer], {
    /**
     * Initializes the chart.
     *
     * @method initializer
     * @private
     */
    initializer: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "initializer", 888);
_yuitest_coverline("build/charts-legend/charts-legend.js", 890);
this._items = [];
    },

    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "renderUI", 897);
_yuitest_coverline("build/charts-legend/charts-legend.js", 899);
var bb = this.get("boundingBox"),
            cb = this.get("contentBox"),
            styles = this.get("styles").background,
            background = new Y.Rect({
                graphic: cb,
                fill: styles.fill,
                stroke: styles.border
            });
        _yuitest_coverline("build/charts-legend/charts-legend.js", 907);
bb.setStyle("display", "block");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 908);
bb.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 909);
this.set("background", background);
    },
    
    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "bindUI", 916);
_yuitest_coverline("build/charts-legend/charts-legend.js", 918);
this.get("chart").after("seriesCollectionChange", Y.bind(this._updateHandler, this));
        _yuitest_coverline("build/charts-legend/charts-legend.js", 919);
this.after("stylesChange", this._updateHandler);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 920);
this.after("positionChange", this._positionChangeHandler);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 921);
this.after("widthChange", this._handleSizeChange);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 922);
this.after("heightChange", this._handleSizeChange);
    },
    
    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "syncUI", 929);
_yuitest_coverline("build/charts-legend/charts-legend.js", 931);
var w = this.get("width"),
            h = this.get("height");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 933);
if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 935);
this._drawLegend();
        }
    },

    /**
     * Handles changes to legend.
     *
     * @method _updateHandler
     * @param {Object} e Event object
     * @private
     */
    _updateHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_updateHandler", 946);
_yuitest_coverline("build/charts-legend/charts-legend.js", 948);
if(this.get("rendered"))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 950);
this._drawLegend();
        }
    },

    /** 
     * Handles position changes.
     *
     * @method _positionChangeHandler
     * @param {Object} e Event object
     * @private
     */
    _positionChangeHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_positionChangeHandler", 961);
_yuitest_coverline("build/charts-legend/charts-legend.js", 963);
var chart = this.get("chart"),
            parentNode = this._parentNode;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 965);
if(parentNode && ((chart && this.get("includeInChartLayout"))))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 967);
this.fire("legendRendered");
        }
        else {_yuitest_coverline("build/charts-legend/charts-legend.js", 969);
if(this.get("rendered"))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 971);
this._drawLegend();
        }}
    },

    /**
     * Updates the legend when the size changes.
     *
     * @method _handleSizeChange
     * @param {Object} e Event object.
     * @private
     */
    _handleSizeChange: function(e)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_handleSizeChange", 982);
_yuitest_coverline("build/charts-legend/charts-legend.js", 984);
var attrName = e.attrName,
            pos = this.get(POSITION),
            vert = pos == LEFT || pos == RIGHT,
            hor = pos == BOTTOM || pos == TOP;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 988);
if((hor && attrName == WIDTH) || (vert && attrName == HEIGHT))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 990);
this._drawLegend();
        }
    },

    /**
     * Draws the legend
     *
     * @method _drawLegend
     * @private
     */
    _drawLegend: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_drawLegend", 1000);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1002);
if(this._drawing)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1004);
this._callLater = true;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1005);
return;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1007);
this._drawing = true;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1008);
this._callLater = false;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1009);
if(this.get("includeInChartLayout"))
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1011);
this.get("chart")._itemRenderQueue.unshift(this);
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1013);
var chart = this.get("chart"),
            node = this.get("contentBox"),
            seriesCollection = chart.get("seriesCollection"),
            series,
            styles = this.get("styles"),
            padding = styles.padding,
            itemStyles = styles.item,
            seriesStyles,
            hSpacing = itemStyles.hSpacing,
            vSpacing = itemStyles.vSpacing,
            hAlign = styles.hAlign,
            vAlign = styles.vAlign,
            marker = styles.marker,
            labelStyles = itemStyles.label,
            displayName,
            layout = this._layout[this.get("direction")],
            i, 
            len,
            isArray,
            shape,
            shapeClass,
            item,
            fill,
            border,
            fillColors,
            borderColors,
            borderWeight,
            items = [],
            markerWidth = marker.width,
            markerHeight = marker.height,
            totalWidth = 0 - hSpacing,
            totalHeight = 0 - vSpacing,
            maxWidth = 0,
            maxHeight = 0,
            itemWidth,
            itemHeight;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1049);
if(marker && marker.shape)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1051);
shape = marker.shape;
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1053);
this._destroyLegendItems();
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1054);
if(chart instanceof Y.PieChart)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1056);
series = seriesCollection[0];
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1057);
displayName = series.get("categoryAxis").getDataByKey(series.get("categoryKey")); 
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1058);
seriesStyles = series.get("styles").marker;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1059);
fillColors = seriesStyles.fill.colors;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1060);
borderColors = seriesStyles.border.colors;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1061);
borderWeight = seriesStyles.border.weight;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1062);
i = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1063);
len = displayName.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1064);
shape = shape || Y.Circle;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1065);
isArray = Y.Lang.isArray(shape);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1066);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1068);
shape = isArray ? shape[i] : shape;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1069);
fill = {
                    color: fillColors[i]
                };
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1072);
border = {
                    colors: borderColors[i],
                    weight: borderWeight
                };
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1076);
displayName = chart.getSeriesItems(series, i).category.value;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1077);
item = this._getLegendItem(node, this._getShapeClass(shape), fill, border, labelStyles, markerWidth, markerHeight, displayName);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1078);
itemWidth = item.width;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1079);
itemHeight = item.height;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1080);
maxWidth = Math.max(maxWidth, itemWidth);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1081);
maxHeight = Math.max(maxHeight, itemHeight);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1082);
totalWidth += itemWidth + hSpacing;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1083);
totalHeight += itemHeight + vSpacing;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1084);
items.push(item);
            }
        }
        else
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1089);
i = 0;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1090);
len = seriesCollection.length;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1091);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1093);
series = seriesCollection[i];
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1094);
seriesStyles = this._getStylesBySeriesType(series, shape);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1095);
if(!shape)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1097);
shape = seriesStyles.shape;
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1098);
if(!shape)
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 1100);
shape = Y.Circle;
                    }
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1103);
shapeClass = Y.Lang.isArray(shape) ? shape[i] : shape;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1104);
item = this._getLegendItem(node, this._getShapeClass(shape), seriesStyles.fill, seriesStyles.border, labelStyles, markerWidth, markerHeight, series.get("valueDisplayName"));
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1105);
itemWidth = item.width;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1106);
itemHeight = item.height;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1107);
maxWidth = Math.max(maxWidth, itemWidth);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1108);
maxHeight = Math.max(maxHeight, itemHeight);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1109);
totalWidth += itemWidth + hSpacing;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1110);
totalHeight += itemHeight + vSpacing;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1111);
items.push(item);
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1114);
this._drawing = false;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1115);
if(this._callLater)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1117);
this._drawLegend();
        }
        else
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1121);
layout._positionLegendItems.apply(this, [items, maxWidth, maxHeight, totalWidth, totalHeight, padding, hSpacing, vSpacing, hAlign, vAlign]);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1122);
this._updateBackground(styles);
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1123);
this.fire("legendRendered");
        }
    },

    /**
     * Updates the background for the legend.
     *
     * @method _updateBackground
     * @param {Object} styles Reference to the legend's styles attribute
     * @private
     */
    _updateBackground: function(styles)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_updateBackground", 1134);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1136);
var backgroundStyles = styles.background,
            contentRect = this._contentRect,
            padding = styles.padding,
            x = contentRect.left - padding.left,
            y = contentRect.top - padding.top,
            w = contentRect.right - x + padding.right,
            h = contentRect.bottom - y + padding.bottom;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1143);
this.get("background").set({
            fill: backgroundStyles.fill,
            stroke: backgroundStyles.border,
            width: w,
            height: h,
            x: x,
            y: y
        });
    },

    /**
     * Retrieves the marker styles based on the type of series. For series that contain a marker, the marker styles are returned.
     * 
     * @method _getStylesBySeriesType
     * @param {CartesianSeries | PieSeries} The series in which the style properties will be received.
     * @return Object An object containing fill, border and shape information.
     * @private
     */
    _getStylesBySeriesType: function(series)
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_getStylesBySeriesType", 1161);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1163);
var styles = series.get("styles"),
            color;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1165);
if(series instanceof Y.LineSeries || series instanceof Y.StackedLineSeries)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1167);
styles = series.get("styles").line;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1168);
color = styles.color || series._getDefaultColor(series.get("graphOrder"), "line");
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1169);
return {
                border: {
                    weight: 1,
                    color: color
                },
                fill: {
                    color: color
                }
            };
        }
        else {_yuitest_coverline("build/charts-legend/charts-legend.js", 1179);
if(series instanceof Y.AreaSeries || series instanceof Y.StackedAreaSeries)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1181);
styles = series.get("styles").area;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1182);
color = styles.color || series._getDefaultColor(series.get("graphOrder"), "slice");
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1183);
return {
                border: {
                    weight: 1,
                    color: color
                },
                fill: {
                    color: color
                }
            };
        }
        else 
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1195);
styles = series.get("styles").marker;
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1196);
return {
                fill: styles.fill,

                border: {
                    weight: styles.border.weight,

                    color: styles.border.color,

                    shape: styles.shape
                },
                shape: styles.shape
            };
        }}
    },

    /**
     * Returns a legend item consisting of the following properties:
     *  <dl>
     *    <dt>node</dt><dd>The `Node` containing the legend item elements.</dd>
     *      <dt>shape</dt><dd>The `Shape` element for the legend item.</dd>
     *      <dt>textNode</dt><dd>The `Node` containing the text></dd>
     *      <dt>text</dt><dd></dd>
     *  </dl>
     *
     * @method _getLegendItem
     * @param {Node} shapeProps Reference to the `node` attribute.
     * @param {String | Class} shapeClass The type of shape
     * @param {Object} fill Properties for the shape's fill
     * @param {Object} border Properties for the shape's border
     * @param {String} text String to be rendered as the legend's text
     * @param {Number} width Total width of the legend item
     * @param {Number} height Total height of the legend item
     * @param {HTML | String} text Text for the legendItem
     * @return Object
     * @private
     */
    _getLegendItem: function(node, shapeClass, fill, border, labelStyles, w, h, text) 
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_getLegendItem", 1232);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1234);
var containerNode = Y.one(DOCUMENT.createElement("div")),
            textField = Y.one(DOCUMENT.createElement("span")),
            shape,
            dimension,
            padding,
            left,
            item;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1241);
containerNode.setStyle(POSITION, "absolute");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1242);
textField.setStyle(POSITION, "absolute");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1243);
textField.setStyles(labelStyles);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1244);
textField.appendChild(DOCUMENT.createTextNode(text));
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1245);
containerNode.appendChild(textField);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1246);
node.appendChild(containerNode);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1247);
dimension = textField.get("offsetHeight");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1248);
padding = dimension - h;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1249);
left = w + padding + 2;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1250);
textField.setStyle("left", left + PX);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1251);
containerNode.setStyle("height", dimension + PX);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1252);
containerNode.setStyle("width", (left + textField.get("offsetWidth")) + PX);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1253);
shape = new shapeClass({
            fill: fill,
            stroke: border,
            width: w,
            height: h,
            x: padding * 0.5,
            y: padding * 0.5,
            w: w,
            h: h,
            graphic: containerNode
        });
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1264);
textField.setStyle("left", dimension + PX);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1265);
item = {
            node: containerNode,
            width: containerNode.get("offsetWidth"),
            height: containerNode.get("offsetHeight"),
            shape: shape,
            textNode: textField,
            text: text
        };
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1273);
this._items.push(item);
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1274);
return item;
    },

    /**
     * Evaluates and returns correct class for drawing a shape.
     *
     * @method _getShapeClass
     * @return Shape
     * @private
     */
    _getShapeClass: function()
    {   
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_getShapeClass", 1284);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1286);
var graphic = this.get("background").get("graphic");
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1287);
return graphic._getShapeClass.apply(graphic, arguments);
    },
    
    /**
     * Returns the default hash for the `styles` attribute.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_getDefaultStyles", 1297);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1299);
var styles = { 
            padding: {
                top: 8,
                right: 8,
                bottom: 8,
                left: 9
            },
            gap: 10,
            hAlign: "center",
            vAlign: "top",
            marker: this._getPlotDefaults(),
            item: {
                hSpacing: 10,
                vSpacing: 5,
                label: {
                    color:"#808080",
                    fontSize:"85%",
                    whiteSpace: "nowrap"
                }
            },
            background: {
                shape: "rect",
                fill:{
                    color:"#faf9f2"
                },
                border: {
                    color:"#dad8c9",
                    weight: 1
                }
            }
        };
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1330);
return styles;
    },

    /**
     * Gets the default values for series that use the utility. This method is used by
     * the class' `styles` attribute's getter to get build default values.
     *
     * @method _getPlotDefaults
     * @return Object
     * @protected
     */
    _getPlotDefaults: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_getPlotDefaults", 1341);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1343);
var defs = {
            width: 10,
            height: 10
        };
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1347);
return defs;
    },

    /**
     * Destroys legend items.
     *
     * @method _destroyLegendItems
     * @private
     */
    _destroyLegendItems: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "_destroyLegendItems", 1356);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1358);
var item;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1359);
if(this._items)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1361);
while(this._items.length > 0)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1363);
item = this._items.shift();
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1364);
item.shape.get("graphic").destroy();
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1365);
item.node.empty();
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1366);
item.node.destroy(true);
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1367);
item.node = null;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1368);
item = null;
            }
        }
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1371);
this._items = [];
    },

    /**
     * Maps layout classes.
     *
     * @property _layout
     * @private
     */
    _layout: {
        vertical: VerticalLegendLayout,
        horizontal: HorizontalLegendLayout
    },

    /**
     * Destructor implementation ChartLegend class. Removes all items and the Graphic instance from the widget.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        _yuitest_coverfunc("build/charts-legend/charts-legend.js", "destructor", 1391);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1393);
var background = this.get("background"),
            backgroundGraphic;
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1395);
this._destroyLegendItems();
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1396);
if(background)
        {
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1398);
backgroundGraphic = background.get("graphic");
            _yuitest_coverline("build/charts-legend/charts-legend.js", 1399);
if(backgroundGraphic)
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1401);
backgroundGraphic.destroy();
            }
            else
            {
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1405);
background.destroy();
            }
        }

    }
}, {
    ATTRS: {
        /**
         * Indicates whether the chart's contentBox is the parentNode for the legend.
         *
         * @attribute includeInChartLayout
         * @type Boolean
         * @private
         */
        includeInChartLayout: {
            value: false
        },

        /**
         * Reference to the `Chart` instance.
         *
         * @attribute chart
         * @type Chart
         */
        chart: {
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "setter", 1430);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1432);
this.after("legendRendered", Y.bind(val._itemRendered, val));
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1433);
return val;
            }
        },

        /**
         * Indicates the direction in relation of the legend's layout. The `direction` of the legend is determined by its
         * `position` value.
         *
         * @attribute direction
         * @type String
         */
        direction: {
            value: "vertical"
        },
       
        /**
         * Indicates the position and direction of the legend. Possible values are `left`, `top`, `right` and `bottom`. Values of `left` and
         * `right` values have a `direction` of `vertical`. Values of `top` and `bottom` values have a `direction` of `horizontal`.
         *
         * @attribute position
         * @type String
         */
        position: {
            lazyAdd: false,

            value: "right",

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "setter", 1460);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1462);
if(val == TOP || val == BOTTOM)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1464);
this.set("direction", HORIZONTAL);
                }
                else {_yuitest_coverline("build/charts-legend/charts-legend.js", 1466);
if(val == LEFT || val == RIGHT)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1468);
this.set("direction", VERTICAL);
                }}
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1470);
return val;
            }
        },
 
        /**
         * The width of the legend. Depending on the implementation of the ChartLegend, this value is `readOnly`. By default, the legend is included in the layout of the `Chart` that 
         * it references. Under this circumstance, `width` is always `readOnly`. When the legend is rendered in its own dom element, the `readOnly` status is determined by the 
         * direction of the legend. If the `position` is `left` or `right` or the `direction` is `vertical`, width is `readOnly`. If the position is `top` or `bottom` or the `direction`
         * is `horizontal`, width can be explicitly set. If width is not explicitly set, the width will be determined by the width of the legend's parent element.
         *
         * @attribute width
         * @type Number
         */
        width: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "getter", 1484);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1486);
var chart = this.get("chart"),
                    parentNode = this._parentNode;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1488);
if(parentNode)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1490);
if((chart && this.get("includeInChartLayout")) || this._width)
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 1492);
if(!this._width)
                        {
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 1494);
this._width = 0;
                        }
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 1496);
return this._width;
                    }
                    else
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 1500);
return parentNode.get("offsetWidth");
                    }
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1503);
return "";
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "setter", 1506);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1508);
this._width = val;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1509);
return val;
            }
        },

        /**
         * The height of the legend. Depending on the implementation of the ChartLegend, this value is `readOnly`. By default, the legend is included in the layout of the `Chart` that 
         * it references. Under this circumstance, `height` is always `readOnly`. When the legend is rendered in its own dom element, the `readOnly` status is determined by the 
         * direction of the legend. If the `position` is `top` or `bottom` or the `direction` is `horizontal`, height is `readOnly`. If the position is `left` or `right` or the `direction`
         * is `vertical`, height can be explicitly set. If height is not explicitly set, the height will be determined by the width of the legend's parent element.
         *
         * @attribute height 
         * @type Number
         */
        height: {
            valueFn: "_heightGetter",

            getter: function()
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "getter", 1525);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1527);
var chart = this.get("chart"),
                    parentNode = this._parentNode;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1529);
if(parentNode) 
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1531);
if((chart && this.get("includeInChartLayout")) || this._height)
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 1533);
if(!this._height)
                        {
                            _yuitest_coverline("build/charts-legend/charts-legend.js", 1535);
this._height = 0;
                        }
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 1537);
return this._height;
                    }
                    else
                    {
                        _yuitest_coverline("build/charts-legend/charts-legend.js", 1541);
return parentNode.get("offsetHeight");
                    }
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1544);
return "";
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "setter", 1547);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1549);
this._height = val;
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1550);
return val;
            }
        },

        /**
         * Indicates the x position of legend.
         *
         * @attribute x
         * @type Number
         * @readOnly
         */
        x: {
            lazyAdd: false,

            value: 0,
            
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "setter", 1566);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1568);
var node = this.get("boundingBox");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1569);
if(node)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1571);
node.setStyle(LEFT, val + PX);
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1573);
return val;
            }
        },

        /**
         * Indicates the y position of legend.
         *
         * @attribute y
         * @type Number
         * @readOnly
         */
        y: {
            lazyAdd: false,

            value: 0,
            
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "setter", 1589);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1591);
var node = this.get("boundingBox");
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1592);
if(node)
                {
                    _yuitest_coverline("build/charts-legend/charts-legend.js", 1594);
node.setStyle(TOP, val + PX);
                }
                _yuitest_coverline("build/charts-legend/charts-legend.js", 1596);
return val;
            }
        },

        /**
         * Array of items contained in the legend. Each item is an object containing the following properties:
         *
         * <dl>
         *      <dt>node</dt><dd>Node containing text for the legend item.</dd>
         *      <dt>marker</dt><dd>Shape for the legend item.</dd>
         * </dl>
         *
         * @attribute items
         * @type Array
         * @readOnly
         */
        items: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-legend/charts-legend.js", "getter", 1613);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1615);
return this._items;
            }
        },

        /**
         * Background for the legend.
         *
         * @attribute background
         * @type Rect
         */
        background: {}

        /**
         * Properties used to display and style the ChartLegend.  This attribute is inherited from `Renderer`. Below are the default values:
         *
         *  <dl>
         *      <dt>gap</dt><dd>Distance, in pixels, between the `ChartLegend` instance and the chart's content. When `ChartLegend` is rendered within a `Chart` instance this value is applied.</dd>
         *      <dt>hAlign</dt><dd>Defines the horizontal alignment of the `items` in a `ChartLegend` rendered in a horizontal direction. This value is applied when the instance's `position` is set to top or bottom. This attribute can be set to left, center or right. The default value is center.</dd>
         *      <dt>vAlign</dt><dd>Defines the vertical alignment of the `items` in a `ChartLegend` rendered in vertical direction. This value is applied when the instance's `position` is set to left or right. The attribute can be set to top, middle or bottom. The default value is middle.</dd>
         *      <dt>item</dt><dd>Set of style properties applied to the `items` of the `ChartLegend`.
         *          <dl>
         *              <dt>hSpacing</dt><dd>Horizontal distance, in pixels, between legend `items`.</dd>
         *              <dt>vSpacing</dt><dd>Vertical distance, in pixels, between legend `items`.</dd>
         *              <dt>label</dt><dd>Properties for the text of an `item`.
         *                  <dl>
         *                      <dt>color</dt><dd>Color of the text. The default values is "#808080".</dd>
         *                      <dt>fontSize</dt><dd>Font size for the text. The default value is "85%".</dd>
         *                  </dl>
         *              </dd>
         *              <dt>marker</dt><dd>Properties for the `item` markers.
         *                  <dl>
         *                      <dt>width</dt><dd>Specifies the width of the markers.</dd>
         *                      <dt>height</dt><dd>Specifies the height of the markers.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         *      <dt>background</dt><dd>Properties for the `ChartLegend` background.
         *          <dl>
         *              <dt>fill</dt><dd>Properties for the background fill.
         *                  <dl>
         *                      <dt>color</dt><dd>Color for the fill. The default value is "#faf9f2".</dd>
         *                  </dl>
         *              </dd>
         *              <dt>border</dt><dd>Properties for the background border.
         *                  <dl>
         *                      <dt>color</dt><dd>Color for the border. The default value is "#dad8c9".</dd>
         *                      <dt>weight</dt><dd>Weight of the border. The default values is 1.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         * </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
/**
 * The Chart class is the basic application used to create a chart.
 *
 * @module charts
 * @class Chart
 * @constructor
 */
_yuitest_coverline("build/charts-legend/charts-legend.js", 1681);
function Chart(cfg)
{
    _yuitest_coverfunc("build/charts-legend/charts-legend.js", "Chart", 1681);
_yuitest_coverline("build/charts-legend/charts-legend.js", 1683);
if(cfg.type != "pie")
    {
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1685);
return new Y.CartesianChart(cfg);
    }
    else
    {
        _yuitest_coverline("build/charts-legend/charts-legend.js", 1689);
return new Y.PieChart(cfg);
    }
}
_yuitest_coverline("build/charts-legend/charts-legend.js", 1692);
Y.Chart = Chart;


}, '3.7.3', {"requires": ["charts-base"]});
