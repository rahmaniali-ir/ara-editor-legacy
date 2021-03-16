<template>
    <window :title="`افزودن ماتریس`" @close="close" @done="done" style="user-select: none;">
        <div class="matrix-wrapper">
            <div class="form">
                <header>مشخصات ماتریس</header>

                <div class="field">
                    <label for="row">ردیف</label>
                    <input v-model="rows" type="number" id="row" min="1" max="9" value="1" />
                </div>

                <div class="field">
                    <label for="column">ستون</label>
                    <input v-model="columns" type="number" id="column" min="1" max="9" value="1" />
                </div>
            </div>

            <div class="preview">
                <section>
                    <header>پیش نمایش ماتریس</header>
                </section>

                <section>
                    <div class="math matrix">
                        <div class="line"></div>
                        <div class="content"
                            :style="{
                                'grid-template-columns': `repeat(${ columns }, 1fr)`,
                                'grid-template-rows': `repeat(${ rows }, 1fr)`,
                                }">
                            <span v-for="(column, index) in Number(rows) * Number(columns)" :key="'matrix-item-' + index" class="place"></span>
                        </div>
                        <div class="line"></div>
                    </div>
                </section>
            </div>
        </div>
    </window>
</template>

<script>
import window from './window';

export default {
    data() {
        return {
            columns: 3,
            rows: 2,
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        done() {
            let html = `
                <div class="math matrix" contenteditable="false">
                    <div class="line"></div>
                    <div class="content" style="grid-template-columns: repeat(${ this.columns }, auto); grid-template-rows: repeat(${ this.rows }, auto);">`;

            for (let i = 0; i < this.rows * this.columns; i++) {
                html += '<span class="place" contenteditable="true"></span>';
            }

            html += `
                    </div>
                    <div class="line"></div>
                </div>`;
            
            this.$emit('done', html);
            this.$emit('close');
        },
    },
    computed: {
    },
    components: {
        window,
    }
}
</script>

<style>

.matrix-wrapper {
    display: flex;
    height: 100%;
    margin-top: 2em;
}

.matrix-wrapper .form {
    border-left: solid 1px #0001;
    flex: 1;
    margin-left: 2em;
    padding-left: 2em;
}

.matrix-wrapper > .preview {
    align-items: center;
    display: flex;
    flex: 5;
    flex-direction: column;
    justify-content: center;
}

.matrix-wrapper header {
    font-size: .8em;
    opacity: .6;
    white-space: nowrap;
}

.matrix-wrapper > .preview > section:last-child {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
}

</style>