<template>
  <div ref="range" class="range" @mousedown="startSelection($event)">
      <div ref="handler" class="handler"></div>
  </div>
</template>

<script>
export default {
    props: {
        min: Number,
        max: Number,
        value: Number,
    },
    data() {
        return {
            minimum: 0,
            maximum: 100,
            length: 100,
            current: 0,
            moving: false,
        };
    },
    methods: {
        startSelection(e) {
            this.moving = true;

            this.current = e.offsetX;
        },
        valueChanged() {
            let range = this.$refs.range.getBoundingClientRect();
            let handler = this.$refs.handler.getBoundingClientRect();

            this.current = (range.width / this.length) * this.value;
        },
    },
    watch: {
        current() {
            let value = this.current;
            let x = value;
            let range = this.$refs.range.getBoundingClientRect().width;
            let handlerElement = this.$refs.handler;
            let handler = handlerElement.getBoundingClientRect().width;

            if(value < 0) {
                value = 0;
            }

            if(value > range) {
                value = range;
            }

            let ratio = value / range;
            let offset = ratio * this.length;

            // Move the handler
            x -= (handler / 2);

            if(x < 0) {
                x = 0;
            }

            if(x + handler > range) {
                x = range - handler;
            }

            handlerElement.style.left = `${ x }px`;

            this.$emit('change', this.minimum + offset);
        },
        value() {
            this.valueChanged();
        },
    },
    mounted() {
        let range = this.$refs.range.getBoundingClientRect();

        // Assign values insted of default ones if they are defined
        if(!!this.max) {
            this.maximum = this.max;

            if(!!this.min) {
                this.minimum = this.min;
            }
        }

        this.length = this.maximum - this.minimum;

        if(!!this.value) {
            this.valueChanged();
        }

        window.addEventListener('mouseup', e => {
            this.moving = false;
        });

        window.addEventListener('mousemove', e => {
            if(this.moving) {
                this.current = e.x - range.left;
            }
        });
    }
}
</script>

<style>

.range {
    background: #0003;
    border-radius: var(--radius);
    box-shadow: 0 1px 3px #0002;
    box-sizing: border-box;
    height: 1em;
    min-width: 3em;
    position: relative;
}

.range .handler {
    border: solid .3em #fff;
    border-radius: 50%;
    box-shadow: 0 2px 2px #0003;
    box-sizing: border-box;
    pointer-events: none;
    position: absolute;
    height: 1em;
    left: 0;
    top: 0;
    transform: scale(1.2);
    transition: all .1s linear;
    width: 1em;
}

</style>