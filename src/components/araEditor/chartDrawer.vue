<template>
    <window :title="`افزودن چارت`" @close="close" @done="done" style="user-select: none;">
        <div class="chart-drawer">
            <div class="details">
                <div class="settings">
                    <div class="property">
                        <label for="chartType">
                            نوع نمودار
                        </label>
                        <div class="value">
                            <div class="select">
                                <div class="currentItem item">دایره ای</div>
                                
                                <div class="items">
                                    <div class="item" @click="changeChartType('pie')">دایره ای</div>
                                    <div class="item" @click="changeChartType('bar')">میله ای</div>
                                    <div class="item" @click="changeChartType('line')">خطی</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="property">
                        <label>
                            طیف رنگی
                        </label>
                        <div class="value">
                            <div class="select">
                                <div class="currentItem item" :style="{background: parseChartColor()}"></div>
                                
                                <div class="items">
                                    <div class="item" v-for="(range, index) in chartColors" :key="'chartColor' + index" @click="changeChartColor(index)"
                                        :style="{background: parseChartColor(range.range)}"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="property">
                        <label for="chartType" v-if="!['line'].includes(chartOptions.type)">
                            ویژگی های نمودار
                        </label>
                        <div class="value">
                            <div class="checksBox">
                                <input type="checkbox" v-if="!['line', 'pie'].includes(chartOptions.type)" id="chartGap" v-model="chartOptions.gap">
                                <label for="chartGap" v-if="!['line', 'pie'].includes(chartOptions.type)">شکاف</label>

                                <input type="checkbox" v-if="!['line'].includes(chartOptions.type)" id="chartTextType" v-model="chartOptions.label">
                                <label for="chartTextType" v-if="!['line'].includes(chartOptions.type)">متن روی نمودار</label>

                                <input type="checkbox" id="chartDrawEmpty" v-if="!['line'].includes(chartOptions.type)" v-model="chartOptions.empty">
                                <label for="chartDrawEmpty" v-if="!['line'].includes(chartOptions.type)">رسم مقادیر خالی</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="data">
                    <label>داده ها</label>

                    <div class="dataWrapper">
                        <table cellspacing="0">
                            <tr>
                                <th>نام</th>
                                <th>مقدار</th>
                                <th>رنگ</th>
                                <th v-if="chartData.length > 1"></th>
                            </tr>

                            <tr v-for="(data, index) in chartData" :key="'chartData' + index">
                                <td>
                                    <input type="text" :placeholder="'داده ' + (index + 1)" v-model="data.name" maxlength="15">
                                </td>

                                <td>
                                    <input type="number" placeholder="مقدار" v-model="data.value" min="0">
                                </td>

                                <td>
                                    <input type="color" v-model="data.color" :id="'chartDataColor' + index">
                                    <label class="colorPicker" :style="{'background-color': data.color}" :for="'chartDataColor' + index"></label>
                                </td>

                                <td v-if="chartData.length > 1">
                                    <button class="delete" @click="deleteChartData(index)" title="حذف" v-html="icons.close"></button>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div class="center action">
                        <button @click="addChartData" title="اضافه کردن داده" v-html="icons.add"></button>
                    </div>
                </div>
            </div>

            <div ref="graphic" class="graphic">
                <canvas></canvas>
            </div>
        </div>
    </window>
</template>

<script>
import window from './window';
import iconPack from './icons';

export default {
    data() {
        return {
            icons: iconPack,
            chartData: [],
            chartOptions: {
                type: 'pie',
                gap: false,
                empty: true,
                label: false,
                fontSize: 16,
                labelPadding: {
                    x: 8,
                    y: 3
                }
            },
            chartScheme: 0,
            chartColors: [
                {
                    colors: {
                        r: { min: 0, max: 255 },
                        g: { min: 0, max: 255 },
                        b: { min: 0, max: 255 },
                        mask: 'r, g, b'
                    },
                    range: [
                        'red',
                        'yellow',
                        'green',
                        'blue',
                        'red'
                    ]
                },
                {
                    colors: {
                        r: { min: 100, max: 255 },
                        x: { min: 0, max: 50 },
                        mask: 'r, x, x'
                    },
                    range: [
                        'rgb(100, 0, 0)',
                        'rgb(255, 0, 0)'
                    ]
                },
                {
                    colors: {
                        x: { min: 50, max: 80 },
                        b: { min: 150, max: 255 },
                        mask: 'x, x, b'
                    },
                    range: [
                        'rgb(0, 50, 100)',
                        'rgb(50, 100, 255)'
                    ]
                },
                {
                    colors: {
                        r: { min: 0, max: 30 },
                        g: { min: 150, max: 200 },
                        b: { min: 100, max: 200 },
                        mask: 'r, g, b'
                    },
                    range: [
                        'rgb(0, 150, 100)',
                        'rgb(30, 200, 200)'
                    ]
                }
            ],
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        done() {
            let graphic = this.$refs.graphic;
            let canvas = graphic.querySelector('canvas');

            if(!graphic || !canvas) {
                return;
            }

            // Create image element
            let image = document.createElement('div');
            image.classList.add('image', 'chart', 'editor-image');
            image.contentEditable = false;

            let imageElement = document.createElement('img');
            image.appendChild(imageElement);

            // Attach canvas image to image
            imageElement.src = canvas.toDataURL();

            this.$emit('done', `&nbsp;${ image.outerHTML }&nbsp;`);
            this.$emit('chart');
        },
        fillRoundRect(canvas, x, y, width, height, radius, fill, strokeWidth, stroke) {
            let c = canvas.getContext('2d');

            const PI = Math.PI;

            if(radius == undefined) {
                radius = 0;
            }

            if(radius < 0) {
                radius = -radius;
            }

            c.fillStyle = fill;
            c.strokeStyle = stroke;
            c.lineWidth = strokeWidth || 0;
            c.beginPath();

            // Top left
            c.moveTo(x + radius, y);

            // Top right
            c.lineTo(x + width - radius, y);
            c.arc(x + width - radius, y + radius, radius, -.5 * PI, 0, false);

            // Bottom right
            c.lineTo(x + width, y + height - radius);
            c.arc(x + width - radius, y + height - radius, radius, 0, PI / 2, false);

            // Bottom left
            c.lineTo(x + radius, y + height);
            c.arc(x + radius, y + height - radius, radius, PI / 2, PI, false);

            // Back to top left
            c.lineTo(x, y + radius);
            c.arc(x + radius, y + radius, radius, PI, 1.5 * PI, false);

            c.fill();

            if(strokeWidth > 0) {
                c.stroke();
            }
        },
        getRandom(min, max) {
            return Math.random() * (max - min) + min;
        },
        randomFromScheme(scheme) {
            if(scheme == undefined) {
                scheme = this.chartScheme;
            }
            
            let color = this.chartColors[scheme].colors;

            let r = 0, g = 0, b = 0, x = 0;

            if(color.r) r = this.getRandom(color.r.min, color.r.max);
            if(color.g) g = this.getRandom(color.g.min, color.g.max);
            if(color.b) b = this.getRandom(color.b.min, color.b.max);
            if(color.x) x = this.getRandom(color.x.min, color.x.max);

            let result = color.mask ? color.mask : 'r, g, b';
            result = result.replace(/r/g, r);
            result = result.replace(/g/g, g);
            result = result.replace(/b/g, b);
            result = result.replace(/x/g, x);

            return `rgb(${ result })`;
        },
        parseChartColor(range) {
            let gradient = 'linear-gradient(to left, ';

            if(!range) {
                range = this.chartColors[0].range;
            }


            range.forEach((color, index) => {
                gradient += color;

                if(index < range.length - 1) {
                    gradient += ', ';
                }
            });
            gradient += ')';

            return gradient;
        },
        addChartData() {
            this.chartData.push({
                name: '',
                value: 1,
                color: this.randomFromScheme()
            });
        },
        deleteChartData(index) {
            if(this.chartData.length <= 1) {
                return;
            }

            this.chartData.splice(index, 1);
        },
        drawChartTexts(canvas, datas) {
            let height = canvas.height;
            let width = canvas.width;

            let c = canvas.getContext('2d');

            let remindedY = height;

            // Initialize draw texts
            const fontSize = this.chartOptions.fontSize;
            c.font = fontSize + 'px sans-serif';
            c.direction = 'rtl';
            c.textAlign = 'right';

            // Get only datas that have value and give them name if don't have
            let filledDatas = [];
            datas.forEach((data, index) => {
                if(data.name.length == 0) {
                    data.name = 'داده ' + (index + 1);
                }
                
                if(this.chartOptions.empty) {
                    filledDatas.push(data);
                } else {
                    if(data.value > 0) {
                        filledDatas.push(data);
                    }
                }
            });

            // Draw texts
            let maxTextWidth = filledDatas.sort((a, b) => c.measureText(a.name).width < c.measureText(b.name).width ? 1 : -1)[0];
            let textWidth = c.measureText(maxTextWidth ? maxTextWidth.name : '').width;
            let row = 0;
            let space = width;
            filledDatas.forEach((data, index) => {
                let text = data.name;

                if(space - textWidth <= textWidth) {
                    space = width;
                    row++;
                }

                let x = space - fontSize * 3;
                space = x - textWidth;

                let y = height - ((fontSize * 1.5) + fontSize) - (row * (fontSize * 1.5));

                c.fillStyle = data.color;
                c.beginPath();
                c.arc(x + fontSize, y - (fontSize / 4), fontSize / 2, 0, Math.PI * 2, false);
                c.fill();

                c.fillStyle = '#000';
                c.fillText(text, x, y);
            });

            // Reduse texts height from the whole height
            remindedY -= (row + 1) * fontSize + (fontSize * 4);

            return remindedY;
        },
        drawArcs(canvas, arcs, radius) {
            let c = canvas.getContext('2d');

            // Get height, width and center of the canvas
            let height = canvas.height;
            let width = canvas.width;
            let h = height / 100;
            let w = width / 100;
            let center = {
                w: w * 50,
                h: h * 50
            };

            // Draw texts and get the size of the rest of the room for the chart
            center.h = this.chartOptions.label ? height / 2 : this.drawChartTexts(canvas, arcs) / 2;

            // Set default radius if it is not defined after labels size subtracted
            if(radius == undefined) {
                radius = center.h * .9;
            }
            
            // Draw placeHolder
            c.beginPath();
            c.fillStyle = '#eee';
            c.arc(center.w, center.h, radius, 0, Math.PI * 2, false);
            c.fill();

            // Draw arcs
            arcs.forEach((arc, index) => {
                // Initialize arc
                if(arc.start == undefined) arc.start = 0;
                if(arc.end == undefined) arc.end = Math.PI * 2;
                if(arc.color == undefined) arc.color = '#eee';

                let x = center.w;
                let y = center.h;
                
                // Draw arc
                c.beginPath();
                c.arc(x, y, radius, arc.start, arc.end, false);
                c.lineTo(center.w, center.h);
                c.fillStyle = arc.color;
                c.fill();
            });

            // Draw labels on charts if chartOptions.label is true
            if(this.chartOptions.label) {
                // Initialize to draw texts
                const fontSize = this.chartOptions.fontSize;
                c.font = fontSize + 'px sans-serif';
                c.textAlign = 'center';
                const padding = this.chartOptions.labelPadding;

                // Draw texts
                arcs.forEach(arc => {
                    // Refuse to draw empty labels
                    if(!arc.name) return;

                    // Get the position of the label (at the edge of the middle of the arc)
                    let textWidth = c.measureText(arc.name).width;
                    let avg = (arc.start + arc.end) / 2;
                    let sin = Math.sin(avg);
                    let cos = Math.cos(avg);
                    let x = center.w + cos * radius;
                    let y = center.h + sin * radius;

                    // Labels background
                    this.fillRoundRect(canvas,
                        x - (textWidth / 2) - padding.x,
                        y - fontSize,
                        textWidth + (padding.x * 2),
                        fontSize + (padding.y * 2),
                        8,
                        '#fffc',
                        1,
                        arc.color
                    );

                    // Draw text
                    c.fillStyle = arc.color;
                    c.fillText(arc.name, x, y);
                });
            }
        },
        drawPieChart(canvas, sum) {
            // Calculate length of each degree
            let degree = (Math.PI * 2) / sum;

            // Calculate each arcs percent
            let arcs = [];
            let start = 0;
            this.chartData.forEach((data, index) => {
                let end = start + data.value * degree;
                arcs.push({
                    name: data.name,
                    start: start,
                    end: end,
                    color: data.color,
                    value: data.value
                });
                start = end;
            });

            // Draw arcs
            this.drawArcs(canvas, arcs);
        },
        drawBarChart(canvas, sum, gap) {
            let c = canvas.getContext('2d');

            // Get only datas that have value
            let filledDatas = [];
            this.chartData.forEach((data, index) => {
                if(this.chartOptions.empty) {
                    filledDatas.push(data);
                } else {
                    if(data.value > 0) {
                        filledDatas.push(data);
                    }
                }
            });

            // Find maximum value
            let maxValue = [...filledDatas].sort((a, b) => b.value - a.value)[0].value;

            // Subtracket label size if it is set to true
            let labelSpace = 0;
            if(this.chartOptions.label) {
                labelSpace = this.chartOptions.fontSize + this.chartOptions.labelPadding.y * 4;
            }

            // Draw texts and get the size of the rest of the room for the chart
            let remindedY = this.chartOptions.label ? canvas.clientHeight : this.drawChartTexts(canvas, this.chartData) - labelSpace;

            // Calculate length of each unit
            let percent = remindedY / maxValue;

            // Calculate width of each bar
            let barWidth = canvas.clientWidth;
            barWidth /= gap ? filledDatas.length * 2 + 1 : filledDatas.length + 2;

            // Draw base line
            c.fillStyle = '#eee';
            c.fillRect(barWidth / 2, remindedY - 1, canvas.clientWidth - barWidth, 1);
            
            // Draw bars
            let start = 0;
            filledDatas.forEach((data, index) => {
                // Initialize to draw bar
                c.fillStyle = data.color;
                let barHight = data.value * percent;

                // Draw the bar
                start += barWidth;
                c.fillRect(start, remindedY - barHight + labelSpace, barWidth, barHight - labelSpace);

                // Add space if gap is true
                if(gap) {
                    start += barWidth;
                }
            });

            // Draw labels on charts if chartOptions.label is true
            if(this.chartOptions.label) {
                // Initialize to draw texts
                const fontSize = this.chartOptions.fontSize;
                c.font = fontSize + 'px sans-serif';
                c.textAlign = 'center';
                const padding = this.chartOptions.labelPadding;

                // Draw texts
                let x = barWidth / 2;
                filledDatas.forEach(data => {
                    // Refuse to draw empty labels
                    if(!data.name) return;

                    // Initialize to draw label
                    let barHight = data.value * percent;

                    // Get the position of the label (at the edge of the middle of the data)
                    let textWidth = c.measureText(data.name).width;
                    
                    // Calculate the position
                    x += barWidth;
                    let y = remindedY - barHight + labelSpace - fontSize + padding.y;

                    // Draw text
                    c.fillStyle = data.color;
                    c.fillText(data.name, x, y);

                    if(gap) {
                        x += barWidth;
                    }
                });
            }
        },
        drawLineChart(canvas, sum, padding) {
            let c = canvas.getContext('2d');

            // Get only datas that have value
            let filledDatas = [];
            this.chartData.forEach((data, index) => {
                if(this.chartOptions.empty) {
                    filledDatas.push(data);
                } else {
                    if(data.value > 0) {
                        filledDatas.push(data);
                    }
                }
            });

            let maxValue = [...filledDatas].sort((a, b) => b.value - a.value)[0].value;

            let pointSize = 6;

            let remindedY = this.drawChartTexts(canvas, this.chartData) - pointSize;
            let percent = remindedY / maxValue;

            let barWidth = canvas.clientWidth;
            barWidth /= padding ? filledDatas.length * 2 + 1 : filledDatas.length + 2;

            // Draw base line
            c.fillStyle = '#eee';
            c.fillRect(barWidth / 2 + pointSize, remindedY - 1 + pointSize, canvas.clientWidth - barWidth, 1);
            
            // Draw line chart
            c.strokeStyle = '#343434';
            c.beginPath();
            let start = barWidth / 2;
            filledDatas.forEach((data, index) => {
                let barHight = data.value * percent;

                start += barWidth;
                c.lineTo(start + pointSize, remindedY - barHight + pointSize);

                if(padding) {
                    start += barWidth * 1.5;
                }
            });
            c.stroke();

            // Draw line chart
            start = barWidth / 2;
            filledDatas.forEach((data, index) => {
                c.beginPath();
                let barHight = data.value * percent;
                c.fillStyle = data.color;
                start += barWidth;
                c.arc(start + pointSize, remindedY - barHight + pointSize, pointSize / 2, 0, Math.PI * 2, false);
                c.fill();

                if(padding) {
                    start += barWidth * 1.5;
                }
            });
        },
        drawChart() {
            let graphic = this.$refs.graphic;
            let canvas = graphic.querySelector('canvas');

            let c = canvas.getContext('2d');
            c.clearRect(0, 0, c.clientWidth, c.clientHeight);

            // Chart canvas fit size
            canvas.height = graphic.clientHeight;
            canvas.width = graphic.clientWidth;

            // Calculate sum of the data
            let sum = this.chartData.reduce((prev, curr) => Number(prev) + Number(curr.value), 0) || 0;

            switch (this.chartOptions.type) {
                case 'pie':
                    this.drawPieChart(canvas, sum, this.chartOptions.gap);
                    break;

                case 'bar':
                    this.drawBarChart(canvas, sum, this.chartOptions.gap);
                    break;

                case 'line':
                    this.chartOptions.empty = true;
                    this.drawLineChart(canvas, sum, this.chartOptions.gap);
                    break;
            }
        },
        changeChartType(type) {
            if(type == 'line') {
                this.chartOptions.empty = true;
                this.chartOptions.gap = false;
            }

            this.chartOptions.type = type;
        },
        changeChartColor(index) {
            this.chartScheme = index;
        },
    },
    watch: {
        chartData: {
            deep: true,
            handler() {
                this.drawChart();
            }
        },
        chartOptions: {
            deep: true,
            handler() {
                this.drawChart();
            }
        },
        chartScheme() {
            this.chartData.forEach((data, index) => {
                this.chartData[index].color = this.randomFromScheme();
            });

            this.drawChart();
        }
    },
    mounted() {
        // Select inputs change
        let selects = document.querySelectorAll('.select');
        selects.forEach(select => select.addEventListener('click', (e) => {
            let target = e.target;
            if(target.classList.contains('item') && !target.classList.contains('currentItem')) {
                let currentItem = e.path[2].querySelector('.currentItem');
                
                currentItem.innerHTML = target.innerHTML;
                currentItem.style.background = target.style.background;
            }
            select.classList.toggle('open');
        }));

        this.addChartData();
    },
    components: {
        window,
    }
}
</script>

<style>
@keyframes itemIn {
    0% {
        opacity: 0;
        transform: translateY(.5em);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.chart-drawer {
    align-items: center;
    display: flex;
    height: 100%;
    text-align: right;
}

.chart-drawer .details {
    border-left: solid 1px #eee;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    padding: .5rem;
    padding-left: 2em;
}

.chart-drawer .details .property {
    margin-bottom: 1em;
}

.chart-drawer .details .property > * {
    display: block;
}

.chart-drawer .details label {
    font-size: .7em;
    margin-bottom: .5em;
    opacity: .7;
}

.chart-drawer .details .property .value {
    position: relative;
}

.chart-drawer .details .property .select,
.chart-drawer .details .property input {
    border-radius: var(--radius);
    box-shadow: 0 10px 8px -8px #0004;
    box-sizing: border-box;
    color: #343434;
    display: block;
    font-family: inherit;
    font-size: .8em;
    outline: none;
    transition: all .3s ease;
    width: 100%;
}

.chart-drawer .details .property input {
    padding: .5em 1em;
}

.chart-drawer .details .property input:hover,
.chart-drawer .details .property input:focus {
    border-color: #ababab;
}

.chart-drawer .details .property .select {
    cursor: pointer;
    position: relative;
    user-select: none;
}

.chart-drawer .details .property .value .select::before,
.chart-drawer .details .property .value .select::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.chart-drawer .details .property .value .select::before {
    background-color: #fffa;
    border-radius: 50%;
    height: 1.5em;
    left: .5em;
    width: 1.5em;
}

.chart-drawer .details .property .value .select::after {
    border: solid .3em transparent;
    border-bottom-width: 0;
    border-top-color: currentColor;
    height: 0;
    left: .9em;
    width: 0;
}

.chart-drawer .details .property .select .item {
    background-color: #f5f5f5;
    border-radius: var(--radius);
    padding: .5em 1em;
    width: 100%;
}

.chart-drawer .details .property .select .item::before {
    display: inline-block;
    content: '';
    height: 1em;
    vertical-align: middle;
    width: 1px;
}

.chart-drawer .details .property .select .items {
    animation: itemIn .3s ease forwards;
    background-color: #fff;
    border-radius: inherit;
    box-shadow: inherit;
    display: none;
    min-width: 100%;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    transform: translateY(.5em);
    top: 0;
    z-index: 500;
}

.chart-drawer .details .property .select.open .items {
    display: block;
}

.chart-drawer .details .property .select .items .item {
    border-radius: 0;
}

.chart-drawer .details .property .checksBox {
    align-items: center;
    display: flex;
    font-size: 1rem;
    position: relative;
    user-select: none;
}

.chart-drawer .details .property .checksBox input {
    position: absolute;
    visibility: hidden;
}

.chart-drawer .details .property .checksBox label {
    border: solid 1px #eee;
    color: #565656;
    cursor: pointer;
    flex: 1;
    font-size: .8em;
    margin: 0;
    padding: .3em 1em;
    text-align: center;
    transition: all .3s ease;
    white-space: nowrap;
}

.chart-drawer .details .property .checksBox label:not(:last-of-type) {
    border-left: none;
}

.chart-drawer .details .property .checksBox label:first-of-type {
    border-bottom-right-radius: var(--radius);
    border-top-right-radius: var(--radius);
}

.chart-drawer .details .property .checksBox label:last-of-type {
    border-bottom-left-radius: var(--radius);
    border-top-left-radius: var(--radius);
}

.chart-drawer .details .property .checksBox label:hover {
    background-color: #f5f5f5;
    color: #000;
}

.chart-drawer .details .property .checksBox input:checked + label {
    background-color: var(--primary);
    border-color: var(--primary);
    color: #fff;
}

.chart-drawer .details .data {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.chart-drawer .details .data .dataWrapper::-webkit-scrollbar {
    width: .3em;
}

.chart-drawer .details .data .dataWrapper {
    overflow-y: auto;
    user-select: none;
}

.chart-drawer .details table tr:nth-child(even) td {
    background-color: #eee;
    color: #323232;
}

.chart-drawer .details table tr td:first-child {
    border-bottom-right-radius: var(--radius);
    border-top-right-radius: var(--radius);
}

.chart-drawer .details table tr td:last-child {
    border-bottom-left-radius: var(--radius);
    border-top-left-radius: var(--radius);
}

.chart-drawer .details table th,
.chart-drawer .details table td {
    box-sizing: border-box;
    font-size: .8em;
    padding: .5em .8em;
    position: relative;
}

.chart-drawer .details table th {
    color: #787878;
    font-size: .7em;
}

.chart-drawer .details table input {
    outline: none;
    padding: 0;
    width: 100%;
}

.chart-drawer .details table input[type="color"] {
    height: 0;
    position: absolute;
    visibility: hidden;
    width: 0;
}

.chart-drawer .details table .colorPicker {
    border-radius: 50%;
    cursor: pointer;
    display: block;
    height: 2em;
    margin: .5em;
    transition: all .3s ease;
    width: 2em;
}

.chart-drawer .details table tr:hover .colorPicker {
    transform: scale(1.3);
}

.chart-drawer .details .data .delete {
    align-items: center;
    display: flex;
}

.chart-drawer .details .data .delete svg {
    fill: currentColor;
    height: .7em;
    width: .7em;
}

.chart-drawer .details .center {
    box-sizing: border-box;
    padding-top: 1em;
    text-align: center;
}

.chart-drawer .details .action button {
    background-color: var(--primary);
    border-radius: 50%;
    box-sizing: border-box;
    height: 1.6em;
    outline: none;
    padding: .4em;
    width: 1.6em;
}

.chart-drawer .details .action button svg {
    display: block;
    fill: #fff;
}

.chart-drawer .graphic {
    flex: 2;
    height: 100%;
}

@media (max-width: 700px) {
    .chart-drawer {
        flex-direction: column-reverse;
        height: initial;
    }

    .chart-drawer .details {
        border: none;
        padding: .5rem;
    }
}

</style>