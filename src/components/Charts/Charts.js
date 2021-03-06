import React from 'react'
import {Bar, Line, HorizontalBar, Pie} from 'react-chartjs-2'

const Charts = ({ layer }) => {
    // standard colors
    let colorsArray = [
        // red, green, blue
        {
            backgroundColor: 'rgba(255,0,0,.2)',
            borderColor: 'rgba(255,0,0,0)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,0,0,.4)',
            hoverBorderColor: 'rgba(255,0,0,0)',
        },
        {
            backgroundColor: 'rgba(0,255,0,.2)',
            borderColor: 'rgba(0,255,0,0)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0,255,0,.4)',
            hoverBorderColor: 'rgba(0,255,0,0)',
        },
        {
            backgroundColor: 'rgba(0,0,255,.2)',
            borderColor: 'rgba(0,0,255,0)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0,0,255,.4)',
            hoverBorderColor: 'rgba(0,0,255,0)',
        },
        {
            backgroundColor: 'rgba(1,122,122,.2)',
            borderColor: 'rgba(1,122,122,0)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(1,122,122,.4)',
            hoverBorderColor: 'rgba(1,122,122,0)',
        },
        {
            backgroundColor: 'rgba(122,1,122,.2)',
            borderColor: 'rgba(122,1,122,0)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(122,1,122,.4)',
            hoverBorderColor: 'rgba(122,1,122,0)',
        },
        {
            backgroundColor: 'rgba(122,122,1,.2)',
            borderColor: 'rgba(122,122,1,0)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(122,122,1,.4)',
            hoverBorderColor: 'rgba(122,122,1,0)',
        },
    ]

    // treat invalid values
    const parseValue = (value) => {
        if (!value) {
            return 0
        }
        if (value === 'não informado') {
            return 0
        }
        return value
    }

    const dataObject = (chart, features) => {
        let dataObj = {
            labels: [],
            datasets: [],
        }

        // get chart labels
        for (var c = 0, lc = chart.columns.length; c < lc; c++) {
            dataObj.labels.push(chart.columns[c][0])
        }

        // if we have valid columns
        if (features) {
            for (let f = 0, lf = features.length; f<lf; f++) {
                // for each element on the chart
                let dataset = {
                    // get the element entity name
                    label: features[f].properties[chart.entity] || '',
                    data: [],
                    ...colorsArray[f],
                }

                // for each column
                for (let c = 0, lc = chart.columns.length; c<lc; c++) {
                    // get the value
                    dataset.data.push( parseValue(features[f].properties[chart.columns[c][1]]) )
                }

                // split datasets if pyramid
                if (chart.type === 'piramide') {
                    // split dataset in half
                    let halfDatasetData = dataset.data.splice(0, Math.ceil(dataset.data.length / 2))
                    // invert values of first half
                    halfDatasetData = halfDatasetData.map(n => n *= -1)
                    // revert values so children goes on the bottom/end
                    halfDatasetData.reverse()
                    dataset.data.reverse()
                    // push it to datasets array
                    let halfDataset = {
                        ...dataset,
                        label: 'Homens',
                        ...colorsArray[2],
                        data: halfDatasetData,
                    }
                    dataObj.datasets.push(halfDataset)
                    // change other half
                    dataset.label = 'Mulheres'
                    dataset = {
                        ...dataset,
                        ...colorsArray[0],
                    }
                }

                // push it to datasets array
                dataObj.datasets.push(dataset)
            }
        }

        // if dataset is pyramid, lose half of labels and reverse them
        if (chart.type === 'piramide') {
            dataObj.labels.splice(0, Math.ceil(dataObj.labels.length / 2))
            dataObj.labels.reverse()
        }

        // if dataset is pie, change items colors' to blue/red/green
        if (chart.type === 'pizza') {
            dataObj.datasets[0].backgroundColor = [
                colorsArray[2].backgroundColor,
                colorsArray[0].backgroundColor,
                colorsArray[1].backgroundColor,
                colorsArray[3].backgroundColor,
                colorsArray[4].backgroundColor,
                colorsArray[5].backgroundColor,
            ]
            dataObj.datasets[0].borderColor = [
                colorsArray[2].borderColor,
                colorsArray[0].borderColor,
                colorsArray[1].borderColor,
                colorsArray[3].borderColor,
                colorsArray[4].borderColor,
                colorsArray[5].borderColor,
            ]
            dataObj.datasets[0].hoverBackgroundColor = [
                colorsArray[2].hoverBackgroundColor,
                colorsArray[0].hoverBackgroundColor,
                colorsArray[1].hoverBackgroundColor,
                colorsArray[3].hoverBackgroundColor,
                colorsArray[4].hoverBackgroundColor,
                colorsArray[5].hoverBackgroundColor,
            ]
            dataObj.datasets[0].hoverBorderColor = [
                colorsArray[2].hoverBorderColor,
                colorsArray[0].hoverBorderColor,
                colorsArray[1].hoverBorderColor,
                colorsArray[3].hoverBorderColor,
                colorsArray[4].hoverBorderColor,
                colorsArray[5].hoverBorderColor,
            ]
        }

        return dataObj
    }

    const chartJSX = (chart, features) => {
        if (chart.type === 'barra') {
            return <Bar data={dataObject(chart, features)}/>
        }
        if (chart.type === 'barra-horizontal') {
            return <HorizontalBar data={dataObject(chart, features)} options={{
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ]
                },
            }}/>
        }
        if (chart.type === 'linha') {
            return <Line data={dataObject(chart, features)}/>
        }
        if (chart.type === 'pizza') {
            return <Pie data={dataObject(chart, features)}/>
        }
        if (chart.type === 'piramide') {
            return <HorizontalBar
                data={dataObject(chart, features)}
                width={353}
                height={350}
                options={{
                    scales: {
                        xAxes: [
                            {
                                display: false,
                            },
                        ],
                        yAxes: [
                            {
                                stacked: true,
                            },
                        ],
                    }
                }}
            />
        }
        return <p>Gráfico com tipo não suportado.</p>
    }

    return (
        <div className="charts">
            {layer && layer.charts.length > 0 ? <h3>Gráficos</h3> : ''}
            {
                layer && layer.charts ? layer.charts.map((chart, indexChart) => {
                    return (
                        <div key={indexChart} className="chart">
                            <p>{chart.title}</p>
                            {chartJSX(chart, layer.features)}
                        </div>
                    )
                }) : null
            }
        </div>
    )
}

export default Charts
