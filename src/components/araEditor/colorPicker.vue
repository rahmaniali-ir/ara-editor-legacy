<template>
    <window :title="`انتخاب رنگ`" @close="close" @done="done" style="user-select: none;">
        <div class="color-picker-wrapper">
            <div class="right">
                <label>رنگ</label>
                <range class="colorWheel hue" :min="0" :max="360" :value="hue" @change="hueChange" :style="{ 'background': getHue() }" />

                <label>اشباع</label>
                <range class="colorWheel satuation" :min="0" :max="100" :value="saturation" @change="satuationChange" :style="{ 'background': getSatuation() }" />

                <label>روشنایی</label>
                <range class="colorWheel lightness" :min="0" :max="100" :value="lightness" @change="lightnessChange" :style="{ 'background': getLightness() }" />

                <label>شفافیت</label>
                <range class="colorWheel alpha" :min="0" :max="1" :value="alpha" @change="alphaChange" :style="{ 'background': getAlpha() }" />

                <label>رنگ های پر کاربرد</label>
                <div class="common">
                    <div
                        v-for="(color, index) in common" :key="'commonColor' + index"
                        class="color"
                        :style="{ 'background-color': `hsla(${ color.h }, ${ color.s }%, ${ color.l }%, ${ color.a })` }"
                        @click="changeColor(color.h, color.s, color.l, color.a)"
                        >
                    </div>
                </div>
            </div>
            
            <div class="left">
                <div ref="colorArea" class="color-area"></div>
            </div>
        </div>
    </window>
</template>

<script>
import window from './window';
import range from './range';

export default {
    data() {
        return {
            test: 190,
            color: '#fff',
            hue: 190,
            saturation: 100,
            lightness: 40,
            alpha: 1,
            common: [
                { h: 210, s: 45, l: 10, a: 1 },
                { h: 204, s: 78, l: 50, a: 1 },
                { h: 145, s: 78, l: 45, a: 1 },
                { h: 28, s: 100, l: 65, a: 1 },
                { h: 6, s: 80, l: 60, a: 1 },
                { h: 0, s: 0, l: 80, a: 1 },
            ]
        }
    },
    methods: {
        updateColor() {
            this.$refs.colorArea.style.background = `hsl(${ this.hue }, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha })`;
        },
        hueChange(value) {
            this.hue = value;

            this.updateColor();
        },
        satuationChange(value) {
            this.saturation = value;

            this.updateColor();
        },
        lightnessChange(value) {
            this.lightness = value;

            this.updateColor();
        },
        alphaChange(value) {
            this.alpha = value;

            this.updateColor();
        },
        close() {
            this.$emit('close');
        },
        done() {
            this.$emit('done', `hsla(${ this.hue }, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha })`);
        },
        getHue() {
            return `linear-gradient(
                to right,
                hsl(0, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha }),
                hsl(60, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha }),
                hsl(120, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha }),
                hsl(180, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha }),
                hsl(240, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha }),
                hsl(300, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha }),
                hsl(360, ${ this.saturation }%, ${ this.lightness }%, ${ this.alpha })
            )`;
        },
        getSatuation() {
            return `linear-gradient(
                to right,
                hsl(${ this.hue }, 0%, ${ this.lightness }%, ${ this.alpha }),
                hsl(${ this.hue }, 100%, ${ this.lightness }%, ${ this.alpha })
            )`;
        },
        getLightness() {
            return `linear-gradient(
                to right,
                hsla(${ this.hue }, ${ this.saturation }%, 0%, ${ this.alpha }),
                hsla(${ this.hue }, ${ this.saturation }%, 50%, ${ this.alpha }),
                hsla(${ this.hue }, ${ this.saturation }%, 100%, ${ this.alpha })
            )`;
        },
        getAlpha() {
            return `linear-gradient(to right, transparent, hsl(${ this.hue }, ${ this.saturation }%, ${ this.lightness }%))`;
        },
        changeColor(h, s, l, a) {
            this.hue = h;
            this.saturation = s;
            this.lightness = l;
            this.alpha = a;
        },
    },
    components: {
        window,
        range
    }
}
</script>

<style>

.color-picker-wrapper {
    display: flex;
    height: 100%;
}

.color-picker-wrapper .right {
    flex: 1;
    margin-left: 1em;
}

.color-picker-wrapper .color-area {
    background-color: #eee;
    border: solid 3px #0002;
    border-radius: var(--radius);
    box-sizing: border-box;
    height: 100%;
    position: relative;
    width: 100%;
}

.color-picker-wrapper .color-area::before,
.color-picker-wrapper .colorWheel::before {
    background: url('./transparent.png');
    background-size: 1em;
    border-radius: inherit;
    content: '';
    height: 100%;
    left: 0;
    opacity: .1;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
}

.color-picker-wrapper .right > label {
    color: #343434;
    display: block;
    font-size: .8em;
    margin-bottom: 1em;
}

.color-picker-wrapper .right > .colorWheel {
    background-repeat: no-repeat;
    margin-bottom: 1em;
}

.color-picker-wrapper .colorWheel.hue {
    width: 100%;
}

.color-picker-wrapper .colorWheel.alpha {
    background-size: 1em;
    position: relative;
    width: 100%;
}

.color-picker-wrapper .common {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fill, 2em);
    grid-template-rows: repeat(auto-fill, 2em);
}

.color-picker-wrapper .common .color {
    border-radius: var(--radius);
    cursor: pointer;
    height: 100%;
    width: 100%;
}

.color-picker-wrapper .common .color:hover {
    transform: scale(.9);
}

.color-picker-wrapper .left {
    flex: 1;
}

</style>