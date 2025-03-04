import {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {ParsedResponseData} from '../ResponsePlot/types';
import {createPlotlyDataObjects} from './utils';
import classes from "../styles.module.scss";
import {RESULT_PARAMETERS} from "@/constants";
import {Button} from "@mui/material";
import {getParameterYPlotRange, useParameterData, useResultsContext} from "@/components";
import {ParameterPlot as ParameterPlotType} from "@/types";
import {
    plotlyDefaultConfig,
    plotlyDefaultLayout,
    plotlyDefaultTitle,
    getParameterYaxisTitle
} from "@/components";


export const ParameterPlot = (
    {
        value,
        index,
    }: {
        value: number,
        index: number,
    }) => {


    const {availableComparisons} = useResultsContext();

    const parameterData: ParameterPlotType[] = useParameterData(availableComparisons);

    const [plotlyData, setPlotlyData] = useState<ParsedResponseData[]>([]);

    const [selectedParameter, setSelectedParameter] = useState(RESULT_PARAMETERS[0]);

    const [yAxisRange, setYAxisRange] = useState<number[]>([]);

    useEffect(() => {
        if (parameterData) {
            const {newPlotlyData} = createPlotlyDataObjects(
                parameterData,
                selectedParameter,
            );

            setPlotlyData(newPlotlyData as ParsedResponseData[]);
        }
    }, [parameterData, selectedParameter]);

    useEffect(() => {
        const yAxisRange = getParameterYPlotRange(selectedParameter, plotlyData);
        setYAxisRange(yAxisRange);
    }, [plotlyData]);


    return (

        <div className={classes.plot_container} style={{display: value === index ? 'block' : 'none'}}>
            <div>
                <div className={classes.plot_header}>
                    <>
                        Select parameter
                    </>
                </div>
                <div className={classes.plot_actions}>
                    {RESULT_PARAMETERS.map((parameter) => (
                        <Button
                            key={parameter}
                            variant={'outlined'}
                            color={parameter === selectedParameter ? 'error' : 'secondary'}
                            onClick={() => setSelectedParameter(parameter)}>
                            {parameter}
                        </Button>
                    ))}
                </div>
            </div>
            <div className={classes.plot}>
                <Plot
                    data={plotlyData}
                    config={plotlyDefaultConfig}
                    style={{height: '100%', width: '100%'}}
                    useResizeHandler={true}
                    layout={
                        {
                            ...plotlyDefaultLayout,
                            yaxis: {
                                ...plotlyDefaultLayout.yaxis,
                                range: yAxisRange,
                                title: {
                                    ...plotlyDefaultTitle,
                                    text: getParameterYaxisTitle(selectedParameter),
                                }
                            },
                        }
                    }
                />
            </div>
        </div>
    );
};
