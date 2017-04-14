/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('charts-legend', function (Y, NAME) {

/**
 * Adds legend functionality to charts.
 *
 * @module charts
 * @submodule charts-legend
 */
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
        var legend = this.get("legend");
        if(legend)
        {
            legend.destroy(true);
        }
        if(val instanceof Y.ChartLegend)
        {
            legend = val;
            legend.set("chart", this);
        }
        else
        {
            val.chart = this;
            if(!val.hasOwnProperty("render"))
            {
                val.render = this.get("contentBox");
                val.includeInChartLayout = true;
            }
            legend = new Y.ChartLegend(val);
        }
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
        HorizontalLegendLayout._setRowArrays(items, limit, horizontalGap);
        rows = HorizontalLegendLayout.rowArray;
        totalWidthArray = HorizontalLegendLayout.totalWidthArray;
        rowsLen = rows.length;
        for(; rowIterator < rowsLen; ++ rowIterator)
        {
            topHeight += verticalGap;
            row = rows[rowIterator];
            len = row.length;
            legendWidth =  HorizontalLegendLayout.getStartPoint(width, totalWidthArray[rowIterator], hAlign, padding);
            for(i = 0; i < len; ++i)
            {
                item = row[i];
                node = item.node;
                itemWidth = item.width;
                itemHeight = item.height;
                item.x = legendWidth;
                item.y = 0;
                left = !isNaN(left) ? Math.min(left, legendWidth) : legendWidth;
                top = !isNaN(top) ? Math.min(top, topHeight) : topHeight;
                right = !isNaN(right) ? Math.max(legendWidth + itemWidth, right) : legendWidth + itemWidth;
                bottom = !isNaN(bottom) ? Math.max(topHeight + itemHeight, bottom) : topHeight + itemHeight;
                node.setStyle("left", legendWidth + PX);
                node.setStyle("top", topHeight + PX);
                legendWidth += itemWidth + horizontalGap;
            }
            topHeight += item.height;
        }
        this._contentRect = {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
        if(this.get("includeInChartLayout"))
        {
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
        var item = items[0],
            rowArray = [[item]],
            i = 1,
            rowIterator = 0,
            len = items.length,
            totalWidth = item.width,
            itemWidth,
            totalWidthArray = [[totalWidth]];
        for(; i < len; ++i)
        {
            item = items[i];
            itemWidth = item.width;
            if((totalWidth + horizontalGap + itemWidth) <= limit)
            {
                totalWidth += horizontalGap + itemWidth;
                rowArray[rowIterator].push(item);
            }
            else
            {
                totalWidth = horizontalGap + itemWidth;
                if(rowArray[rowIterator])
                {
                    rowIterator += 1;
                }
                rowArray[rowIterator] = [item];
            }
            totalWidthArray[rowIterator] = totalWidth;
        }
        HorizontalLegendLayout.rowArray = rowArray;
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
        var startPoint;
        switch(align)
        {
            case LEFT :
                startPoint = padding.left;
            break;
            case "center" :
                startPoint = (w - totalWidth) * 0.5;
            break;
            case RIGHT :
                startPoint = w - totalWidth - padding.right;
            break;
        }
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
        VerticalLegendLayout._setColumnArrays(items, limit, verticalGap);
        columns = VerticalLegendLayout.columnArray;
        totalHeightArray = VerticalLegendLayout.totalHeightArray;
        columnsLen = columns.length;
        for(; columnIterator < columnsLen; ++ columnIterator)
        {
            leftWidth += horizontalGap;
            column = columns[columnIterator];
            len = column.length;
            legendHeight =  VerticalLegendLayout.getStartPoint(height, totalHeightArray[columnIterator], vAlign, padding);
            legendWidth = 0;
            for(i = 0; i < len; ++i)
            {
                item = column[i];
                node = item.node;
                itemHeight = item.height;
                itemWidth = item.width;
                item.y = legendHeight;
                item.x = leftWidth;
                left = !isNaN(left) ? Math.min(left, leftWidth) : leftWidth;
                top = !isNaN(top) ? Math.min(top, legendHeight) : legendHeight;
                right = !isNaN(right) ? Math.max(leftWidth + itemWidth, right) : leftWidth + itemWidth;
                bottom = !isNaN(bottom) ? Math.max(legendHeight + itemHeight, bottom) : legendHeight + itemHeight;
                node.setStyle("left", leftWidth + PX);
                node.setStyle("top", legendHeight + PX);
                legendHeight += itemHeight + verticalGap;
                legendWidth = Math.max(legendWidth, item.width);
            }
            leftWidth += legendWidth;
        }
        this._contentRect = {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
        if(this.get("includeInChartLayout"))
        {
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
        var item = items[0],
            columnArray = [[item]],
            i = 1,
            columnIterator = 0,
            len = items.length,
            totalHeight = item.height,
            itemHeight,
            totalHeightArray = [[totalHeight]];
        for(; i < len; ++i)
        {
            item = items[i];
            itemHeight = item.height;
            if((totalHeight + verticalGap + itemHeight) <= limit)
            {
                totalHeight += verticalGap + itemHeight;
                columnArray[columnIterator].push(item);
            }
            else
            {
                totalHeight = verticalGap + itemHeight;
                if(columnArray[columnIterator])
                {
                    columnIterator += 1;
                }
                columnArray[columnIterator] = [item];
            }
            totalHeightArray[columnIterator] = totalHeight;
        }
        VerticalLegendLayout.columnArray = columnArray;
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
        var startPoint;
        switch(align)
        {
            case TOP :
                startPoint = padding.top;
            break;
            case "middle" :
                startPoint = (h - totalHeight) * 0.5;
            break;
            case BOTTOM :
                startPoint = h - totalHeight - padding.bottom;
            break;
        }
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
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
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

        if(leftAxesCollection)
        {
            leftAxesXCoords = [];
            l = leftAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                leftAxesXCoords.unshift(leftPaneWidth);
                leftPaneWidth += leftAxesCollection[i].get("width");
            }
        }
        if(rightAxesCollection)
        {
            rightAxesXCoords = [];
            l = rightAxesCollection.length;
            i = 0;
            for(i = l - 1; i > -1; --i)
            {
                rightPaneWidth += rightAxesCollection[i].get("width");
                rightAxesXCoords.unshift(w - rightPaneWidth);
            }
        }
        if(topAxesCollection)
        {
            topAxesYCoords = [];
            l = topAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                topAxesYCoords.unshift(topPaneHeight);
                topPaneHeight += topAxesCollection[i].get("height");
            }
        }
        if(bottomAxesCollection)
        {
            bottomAxesYCoords = [];
            l = bottomAxesCollection.length;
            for(i = l - 1; i > -1; --i)
            {
                bottomPaneHeight += bottomAxesCollection[i].get("height");
                bottomAxesYCoords.unshift(h - bottomPaneHeight);
            }
        }
        
        graphWidth = w - (leftPaneWidth + rightPaneWidth);
        graphHeight = h - (bottomPaneHeight + topPaneHeight);
        graphRect.left = leftPaneWidth;
        graphRect.top = topPaneHeight;
        graphRect.bottom = h - bottomPaneHeight;
        graphRect.right = w - rightPaneWidth;
        if(!allowContentOverflow)
        {
            topOverflow = this._getTopOverflow(leftAxesCollection, rightAxesCollection);
            bottomOverflow = this._getBottomOverflow(leftAxesCollection, rightAxesCollection);
            leftOverflow = this._getLeftOverflow(bottomAxesCollection, topAxesCollection);
            rightOverflow = this._getRightOverflow(bottomAxesCollection, topAxesCollection);
            
            diff = topOverflow - topPaneHeight;
            if(diff > 0)
            {
                graphRect.top = topOverflow;
                if(topAxesYCoords)
                {
                    i = 0;
                    l = topAxesYCoords.length;
                    for(; i < l; ++i)
                    {
                        topAxesYCoords[i] += diff;
                    }
                }
            }

            diff = bottomOverflow - bottomPaneHeight;
            if(diff > 0)
            {
                graphRect.bottom = h - bottomOverflow;
                if(bottomAxesYCoords)
                {
                    i = 0;
                    l = bottomAxesYCoords.length;
                    for(; i < l; ++i)
                    {
                        bottomAxesYCoords[i] -= diff;
                    }
                }
            }

            diff = leftOverflow - leftPaneWidth;
            if(diff > 0)
            {
                graphRect.left = leftOverflow;
                if(leftAxesXCoords)
                {
                    i = 0;
                    l = leftAxesXCoords.length;
                    for(; i < l; ++i)
                    {
                        leftAxesXCoords[i] += diff;
                    }
                }
            }

            diff = rightOverflow - rightPaneWidth;
            if(diff > 0)
            {
                graphRect.right = w - rightOverflow;
                if(rightAxesXCoords)
                {
                    i = 0;
                    l = rightAxesXCoords.length;
                    for(; i < l; ++i)
                    {
                        rightAxesXCoords[i] -= diff;
                    }
                }
            }
        }
        graphWidth = graphRect.right - graphRect.left;
        graphHeight = graphRect.bottom - graphRect.top;
        graphX = graphRect.left;
        graphY = graphRect.top;
        if(legend)
        {
            if(legend.get("includeInChartLayout"))
            {
                switch(legend.get("position"))
                {
                    case "left" : 
                        legend.set("y", graphY);
                        legend.set("height", graphHeight);
                    break;
                    case "top" :
                        legend.set("x", graphX);
                        legend.set("width", graphWidth);
                    break;
                    case "bottom" : 
                        legend.set("x", graphX);
                        legend.set("width", graphWidth);
                    break;
                    case "right" :
                        legend.set("y", graphY);
                        legend.set("height", graphHeight);
                    break;
                }
            }
        }
        if(topAxesCollection)
        {
            l = topAxesCollection.length;
            i = 0;
            for(; i < l; i++)
            {
                axis = topAxesCollection[i];
                if(axis.get("width") !== graphWidth)
                {
                    axis.set("width", graphWidth);
                }
                axis.get("boundingBox").setStyle("left", graphX + PX);
                axis.get("boundingBox").setStyle("top", topAxesYCoords[i] + PX);
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(bottomAxesCollection)
        {
            l = bottomAxesCollection.length;
            i = 0;
            for(; i < l; i++)
            {
                axis = bottomAxesCollection[i];
                if(axis.get("width") !== graphWidth)
                {
                    axis.set("width", graphWidth);
                }
                axis.get("boundingBox").setStyle("left", graphX + PX);
                axis.get("boundingBox").setStyle("top", bottomAxesYCoords[i] + PX);
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(leftAxesCollection)
        {
            l = leftAxesCollection.length;
            i = 0;
            for(; i < l; ++i)
            {
                axis = leftAxesCollection[i];
                axis.get("boundingBox").setStyle("top", graphY + PX);
                axis.get("boundingBox").setStyle("left", leftAxesXCoords[i] + PX);
                if(axis.get("height") !== graphHeight)
                {
                    axis.set("height", graphHeight);
                }
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        if(rightAxesCollection)
        {
            l = rightAxesCollection.length;
            i = 0;
            for(; i < l; ++i)
            {
                axis = rightAxesCollection[i];
                axis.get("boundingBox").setStyle("top", graphY + PX);
                axis.get("boundingBox").setStyle("left", rightAxesXCoords[i] + PX);
                if(axis.get("height") !== graphHeight)
                {
                    axis.set("height", graphHeight);
                }
            }
            if(axis._hasDataOverflow())
            {
                graphOverflow = "hidden";
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._redraw();
            return;
        }
        if(graph)
        {
            graph.get("boundingBox").setStyle("left", graphX + PX);
            graph.get("boundingBox").setStyle("top", graphY + PX);
            graph.set("width", graphWidth);
            graph.set("height", graphHeight);
            graph.get("boundingBox").setStyle("overflow", graphOverflow);
        }

        if(this._overlay)
        {
            this._overlay.setStyle("left", graphX + PX);
            this._overlay.setStyle("top", graphY + PX);
            this._overlay.setStyle("width", graphWidth + PX);
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
        if(legend && legend.get("includeInChartLayout"))
        {
            gap = legend.get("styles").gap;
            position = legend.get(POSITION);
            if(position != EXTERNAL)
            {
                direction = legend.get("direction");
                dimension = direction == HORIZONTAL ? HEIGHT : WIDTH;
                size = legend.get(dimension);
                box[position] = size + gap;
                switch(position)
                {
                    case TOP :
                        legend.set(_Y, 0); 
                    break;
                    case BOTTOM : 
                        legend.set(_Y, h - size); 
                    break;
                    case RIGHT :
                        legend.set(_X, w - size);
                    break;
                    case LEFT: 
                        legend.set(_X, 0);
                    break;
                }
            }
        }
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
        var legend = this.get("legend");
        if(legend)
        {
            legend.destroy(true);
        }
    }
}, {
    ATTRS: {
        legend: LEGEND
    }
});

Y.CartesianChart = CartesianChartLegend;

var PieChartLegend = Y.Base.create("pieChartLegend", Y.PieChart, [], {
    /**
     * Redraws the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
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
        if(graph)
        {
            if(legend)
            {
                position = legend.get("position");
                direction = legend.get("direction");
                graphWidth = graph.get("width");
                graphHeight = graph.get("height");
                legendWidth = legend.get("width");
                legendHeight = legend.get("height");
                gap = legend.get("styles").gap;
                
                if((direction == "vertical" && (graphWidth + legendWidth + gap !== w)) || (direction == "horizontal" &&  (graphHeight + legendHeight + gap !== h)))
                {
                    switch(legend.get("position"))
                    {
                        case LEFT :
                            dimension = Math.min(w - (legendWidth + gap), h);
                            legendHeight = h;
                            x = legendWidth + gap;
                            legend.set(HEIGHT, legendHeight);
                        break;
                        case TOP :
                            dimension = Math.min(h - (legendHeight + gap), w); 
                            legendWidth = w;
                            y = legendHeight + gap;
                            legend.set(WIDTH, legendWidth);
                        break;
                        case RIGHT :
                            dimension = Math.min(w - (legendWidth + gap), h);
                            legendHeight = h;
                            legendX = dimension + gap;
                            legend.set(HEIGHT, legendHeight);
                        break;
                        case BOTTOM :
                            dimension = Math.min(h - (legendHeight + gap), w); 
                            legendWidth = w;
                            legendY = dimension + gap; 
                            legend.set(WIDTH, legendWidth);
                        break;
                    }
                    graph.set(WIDTH, dimension);
                    graph.set(HEIGHT, dimension);
                }
                else
                {
                    switch(legend.get("position"))
                    {   
                        case LEFT :
                            x = legendWidth + gap;
                        break;
                        case TOP :
                            y = legendHeight + gap;
                        break;
                        case RIGHT :
                            legendX = graphWidth + gap;
                        break;
                        case BOTTOM :
                            legendY = graphHeight + gap; 
                        break;
                    }
                }
            }
            else
            {
                graph.set(_X, 0);
                graph.set(_Y, 0);
                graph.set(WIDTH, w);
                graph.set(HEIGHT, h);
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._redraw();
            return;
        }
        if(graph)
        {
            graph.set(_X, x);
            graph.set(_Y, y);
        }
        if(legend)
        {
            legend.set(_X, legendX);
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
Y.PieChart = PieChartLegend;
/**
 * ChartLegend provides a legend for a chart.
 *
 * @class ChartLegend
 * @module charts
 * @submodule charts-legend
 * @extends Widget
 */
Y.ChartLegend = Y.Base.create("chartlegend", Y.Widget, [Y.Renderer], {
    /**
     * Initializes the chart.
     *
     * @method initializer
     * @private
     */
    initializer: function()
    {
        this._items = [];
    },

    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        var bb = this.get("boundingBox"),
            cb = this.get("contentBox"),
            styles = this.get("styles").background,
            background = new Y.Rect({
                graphic: cb,
                fill: styles.fill,
                stroke: styles.border
            });
        bb.setStyle("display", "block");
        bb.setStyle("position", "absolute");
        this.set("background", background);
    },
    
    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        this.get("chart").after("seriesCollectionChange", Y.bind(this._updateHandler, this));
        this.after("stylesChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("widthChange", this._handleSizeChange);
        this.after("heightChange", this._handleSizeChange);
    },
    
    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        var w = this.get("width"),
            h = this.get("height");
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
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
        if(this.get("rendered"))
        {
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
        var chart = this.get("chart"),
            parentNode = this._parentNode;
        if(parentNode && ((chart && this.get("includeInChartLayout"))))
        {
            this.fire("legendRendered");
        }
        else if(this.get("rendered"))
        {
            this._drawLegend();
        }
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
        var attrName = e.attrName,
            pos = this.get(POSITION),
            vert = pos == LEFT || pos == RIGHT,
            hor = pos == BOTTOM || pos == TOP;
        if((hor && attrName == WIDTH) || (vert && attrName == HEIGHT))
        {
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
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        if(this.get("includeInChartLayout"))
        {
            this.get("chart")._itemRenderQueue.unshift(this);
        }
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
        if(marker && marker.shape)
        {
            shape = marker.shape;
        }
        this._destroyLegendItems();
        if(chart instanceof Y.PieChart)
        {
            series = seriesCollection[0];
            displayName = series.get("categoryAxis").getDataByKey(series.get("categoryKey")); 
            seriesStyles = series.get("styles").marker;
            fillColors = seriesStyles.fill.colors;
            borderColors = seriesStyles.border.colors;
            borderWeight = seriesStyles.border.weight;
            i = 0;
            len = displayName.length;
            shape = shape || Y.Circle;
            isArray = Y.Lang.isArray(shape);
            for(; i < len; ++i)
            {
                shape = isArray ? shape[i] : shape;
                fill = {
                    color: fillColors[i]
                };
                border = {
                    colors: borderColors[i],
                    weight: borderWeight
                };
                displayName = chart.getSeriesItems(series, i).category.value;
                item = this._getLegendItem(node, this._getShapeClass(shape), fill, border, labelStyles, markerWidth, markerHeight, displayName);
                itemWidth = item.width;
                itemHeight = item.height;
                maxWidth = Math.max(maxWidth, itemWidth);
                maxHeight = Math.max(maxHeight, itemHeight);
                totalWidth += itemWidth + hSpacing;
                totalHeight += itemHeight + vSpacing;
                items.push(item);
            }
        }
        else
        {
            i = 0;
            len = seriesCollection.length;
            for(; i < len; ++i)
            {
                series = seriesCollection[i];
                seriesStyles = this._getStylesBySeriesType(series, shape);
                if(!shape)
                {
                    shape = seriesStyles.shape;
                    if(!shape)
                    {
                        shape = Y.Circle;
                    }
                }
                shapeClass = Y.Lang.isArray(shape) ? shape[i] : shape;
                item = this._getLegendItem(node, this._getShapeClass(shape), seriesStyles.fill, seriesStyles.border, labelStyles, markerWidth, markerHeight, series.get("valueDisplayName"));
                itemWidth = item.width;
                itemHeight = item.height;
                maxWidth = Math.max(maxWidth, itemWidth);
                maxHeight = Math.max(maxHeight, itemHeight);
                totalWidth += itemWidth + hSpacing;
                totalHeight += itemHeight + vSpacing;
                items.push(item);
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._drawLegend();
        }
        else
        {
            layout._positionLegendItems.apply(this, [items, maxWidth, maxHeight, totalWidth, totalHeight, padding, hSpacing, vSpacing, hAlign, vAlign]);
            this._updateBackground(styles);
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
        var backgroundStyles = styles.background,
            contentRect = this._contentRect,
            padding = styles.padding,
            x = contentRect.left - padding.left,
            y = contentRect.top - padding.top,
            w = contentRect.right - x + padding.right,
            h = contentRect.bottom - y + padding.bottom;
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
        var styles = series.get("styles"),
            color;
        if(series instanceof Y.LineSeries || series instanceof Y.StackedLineSeries)
        {
            styles = series.get("styles").line;
            color = styles.color || series._getDefaultColor(series.get("graphOrder"), "line");
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
        else if(series instanceof Y.AreaSeries || series instanceof Y.StackedAreaSeries)
        {
            styles = series.get("styles").area;
            color = styles.color || series._getDefaultColor(series.get("graphOrder"), "slice");
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
            styles = series.get("styles").marker;
            return {
                fill: styles.fill,

                border: {
                    weight: styles.border.weight,

                    color: styles.border.color,

                    shape: styles.shape
                },
                shape: styles.shape
            };
        }
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
        var containerNode = Y.one(DOCUMENT.createElement("div")),
            textField = Y.one(DOCUMENT.createElement("span")),
            shape,
            dimension,
            padding,
            left,
            item;
        containerNode.setStyle(POSITION, "absolute");
        textField.setStyle(POSITION, "absolute");
        textField.setStyles(labelStyles);
        textField.appendChild(DOCUMENT.createTextNode(text));
        containerNode.appendChild(textField);
        node.appendChild(containerNode);
        dimension = textField.get("offsetHeight");
        padding = dimension - h;
        left = w + padding + 2;
        textField.setStyle("left", left + PX);
        containerNode.setStyle("height", dimension + PX);
        containerNode.setStyle("width", (left + textField.get("offsetWidth")) + PX);
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
        textField.setStyle("left", dimension + PX);
        item = {
            node: containerNode,
            width: containerNode.get("offsetWidth"),
            height: containerNode.get("offsetHeight"),
            shape: shape,
            textNode: textField,
            text: text
        };
        this._items.push(item);
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
        var graphic = this.get("background").get("graphic");
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
        var defs = {
            width: 10,
            height: 10
        };
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
        var item;
        if(this._items)
        {
            while(this._items.length > 0)
            {
                item = this._items.shift();
                item.shape.get("graphic").destroy();
                item.node.empty();
                item.node.destroy(true);
                item.node = null;
                item = null;
            }
        }
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
        var background = this.get("background"),
            backgroundGraphic;
        this._destroyLegendItems();
        if(background)
        {
            backgroundGraphic = background.get("graphic");
            if(backgroundGraphic)
            {
                backgroundGraphic.destroy();
            }
            else
            {
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
                this.after("legendRendered", Y.bind(val._itemRendered, val));
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
                if(val == TOP || val == BOTTOM)
                {
                    this.set("direction", HORIZONTAL);
                }
                else if(val == LEFT || val == RIGHT)
                {
                    this.set("direction", VERTICAL);
                }
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
                var chart = this.get("chart"),
                    parentNode = this._parentNode;
                if(parentNode)
                {
                    if((chart && this.get("includeInChartLayout")) || this._width)
                    {
                        if(!this._width)
                        {
                            this._width = 0;
                        }
                        return this._width;
                    }
                    else
                    {
                        return parentNode.get("offsetWidth");
                    }
                }
                return "";
            },

            setter: function(val)
            {
                this._width = val;
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
                var chart = this.get("chart"),
                    parentNode = this._parentNode;
                if(parentNode) 
                {
                    if((chart && this.get("includeInChartLayout")) || this._height)
                    {
                        if(!this._height)
                        {
                            this._height = 0;
                        }
                        return this._height;
                    }
                    else
                    {
                        return parentNode.get("offsetHeight");
                    }
                }
                return "";
            },

            setter: function(val)
            {
                this._height = val;
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
                var node = this.get("boundingBox");
                if(node)
                {
                    node.setStyle(LEFT, val + PX);
                }
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
                var node = this.get("boundingBox");
                if(node)
                {
                    node.setStyle(TOP, val + PX);
                }
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
function Chart(cfg)
{
    if(cfg.type != "pie")
    {
        return new Y.CartesianChart(cfg);
    }
    else
    {
        return new Y.PieChart(cfg);
    }
}
Y.Chart = Chart;


}, '3.7.3', {"requires": ["charts-base"]});
