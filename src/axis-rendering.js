//TODO UP-1371 this should be pulled from our fork of DC's repo
/**
## <a name="axis-rendering" href="#axis-rendering">#</a> Axis Rendering

Axis Rendering is a mixin that provides hooks to define additional drawing behaviour on the x or y axis

**/
dc.axisRendering = function (_chart) {
    var _transformOptions = {};
    var createTransformRenderlet = function (axisType) {
        return function (tickTextElements) {
            var minWidth;
            var options = _transformOptions[axisType];
            var passWidthCheck = false;

            if (!options) {
                return;
            }

            if (options.minWidth) {
                minWidth = (typeof options.minWidth === 'function') ? options.minWidth() : options.minWidth;
                tickTextElements.each(function() {
                    var text = d3.select(this);
                    if(text.node().getComputedTextLength() >= minWidth) {
                        passWidthCheck = true;
                    }
                });
            } else {
                passWidthCheck = true;
            }

            if (!passWidthCheck) {
                return;
            }

            tickTextElements.each(function() {
                var text = d3.select(this);
                var transform = "";

                if (options.translateX || options.translateY) {
                    transform += " translate(" + (options.translateX || 0) + "," + (options.translateY || 0) + ")";
                }

                if (options.rotate) {
                    transform += " rotate(" + options.rotate + "," +
                        (text.attr("x") || 0) + "," + (text.attr("y") || 0) + ")";
                }

                if (transform) {
                    text.attr("transform", transform);
                }
            });
        };
    };
    var setupRenderlets = function (axisType) {
        return {
            transform: createTransformRenderlet(axisType)
        };
    };
    var _renderlets = {
        x: setupRenderlets("x"),
        y: setupRenderlets("y"),
    };
    var getRenderlets = function (axisType) {
        var renderlets = _renderlets[axisType];
        return [renderlets.transform, renderlets.custom];
    };

    /**
    #### .xTransformTickText([options])
    Set or get tick text transformation for the x axis. The transformation options are stored as an object where:

    Parameters:

    * rotate : number (optional) - the amount of degrees to rotate the tick text by
    * translateX: number (optional) - the amount to translate the tick text in the x direction
    * translateY: number (optional) - the amount to translate the tick text in the y direction
    * minWidth : number | function (optional) - the minimum length any tick text needs to be before the transformation is applied to the entire axis

    ```js
    // set x axis tick text rotation
    chart.xTransformTickText({rotate: 270});

    // set x axis tick text rotation only if any text is wider than minWidth
    chart.xTransformTickText({rotate: 270, minWidth: 30});

    // set x axis tick text translation and rotation
    chart.xTransformTickText({rotate: 270, translateX: 10});
    ```

    **/
    _chart.xTransformTickText = function(_) {
        if (!arguments.length) return _transformOptions.x;
        _transformOptions.x = _;
        return _chart;
    };

    /**
    #### .yTransformTickText([options])
    Set or get tick text transformation for the y axis. The transformation options are stored as an object where:

    Parameters:

    * rotate : number (optional) - the amount of degrees to rotate the tick text by
    * translateX: number (optional) - the amount to translate the tick text in the x direction
    * translateY: number (optional) - the amount to translate the tick text in the y direction
    * minWidth : number (optional) - the minimum length any tick text needs to be before the transformation is applied to the entire axis

    ```js
    // set y axis tick text rotation
    chart.yTransformTickText({rotate: 270});

    // set y axis tick text rotation only if any text is wider than minWidth
    chart.yTransformTickText({rotate: 270, minWidth: 30});

    // set y axis tick text translation and rotation
    chart.yTransformTickText({rotate: 270, translateX: 10});
    ```

    **/
    _chart.yTransformTickText = function(_) {
        if (!arguments.length) return _transformOptions.y;
        _transformOptions.y = _;
        return _chart;
    };

    /**
    #### .xTickTextRenderlet([renderlet])
    Set or get the function used to provide additional rendering on the x axis tick text.
    The renderlet will be passed the selection of all tick text elements on the axis.

    ```js
    // customize x axis tick text rendering
    chart.xTickTextRenderlet(function(textElements) {
        textElements.each(function() {
            var text = d3.select(this);
            text.attr("y", text.attr("y") + 10);
        });
    });
    ```

    **/
    _chart.xTickTextRenderlet = function (_) {
        if (!arguments.length) return _renderlets.x.custom;
        _renderlets.x.custom = _;
        return _chart;
    };

    /**
    #### .yTickTextRenderlet([renderlet])
    Set or get the function used to provide additional rendering on the y axis tick text.
    The renderlet will be passed the selection of all tick text elements on the axis.

    ```js
    // customize y axis tick text rendering
    chart.yTickTextRenderlet(function(textElements) {
        textElements.each(function() {
            var text = d3.select(this);
            text.attr("x", text.attr("x") - 10);
        });
    });
    ```

    **/
    _chart.yTickTextRenderlet = function (_) {
        if (!arguments.length) return _renderlets.y.custom;
        _renderlets.y.custom = _;
        return _chart;
    };

    _chart._axisRenderlet = function(axisSelection, axisType) {
        var tickTextElements = axisSelection.selectAll(".tick text");
        var renderlets = getRenderlets(axisType);
        for (var i = 0; i < renderlets.length; i++) {
            if (renderlets[i]) {
                tickTextElements.call(renderlets[i]);
            }
        }
    };

    return _chart;
};
