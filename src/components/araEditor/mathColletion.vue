<template>
    <window :title="title" :hideAction="true" @close="close">
        <div ref="collection" class="mathCollection">
            <section>
                <h2>عبارت</h2>

                <div class="part">
                    <div v-for="(item, name) in math.templates" :key="'equation-template-' + name"
                        class="item"
                        @click="done(item.template)"
                    >
                        <div class="item-template" v-html="item.template"></div>
                        <div class="item-name">{{ item.title }}</div>
                    </div>
                </div>
            </section>

            <section>
                <h2>مثال های پر کاربرد</h2>

                <div class="part">
                    <div v-for="(item, name) in math.examples" :key="'equation-example-' + name"
                        class="item"
                        @click="done(item.template)"
                    >
                        <div class="item-template" v-html="item.template"></div>
                        <div class="item-name">{{ item.title }}</div>
                    </div>
                </div>
            </section>
        </div>
    </window>
</template>

<script>
import window from './window';
import mathPack from './math';

export default {
    props: {
        title: String,
        equation: String,
    },
    data() {
        return {
            math: {
                templates: [],
            },
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        done(template) {
            this.$emit('done', template);
            this.$emit('close');
        },
    },
    computed: {
    },
    components: {
        window,
    },
    mounted() {
        this.math = mathPack[this.equation];

        // Animations
        let titles = this.$refs.collection.querySelectorAll('h2');
        titles.forEach((title, index) => {
            setTimeout(() => {
                title.classList.add('show');
            }, index * 50);
        });
    },
    updated() {
        // Animations
        let items = this.$refs.collection.querySelectorAll('.item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
            }, index * 50);
        });
    },
}
</script>

<style>

.mathCollection {
    user-select: none;
}

.mathCollection section {
    margin: 1em 0;
}

.mathCollection section h2 {
    box-sizing: border-box;
    font-size: .8em;
    font-weight: normal;
    opacity: 0;
    padding: .5em;
    position: relative;
    transition: all .5s ease;
}

.mathCollection section h2.show {
    opacity: 1;
}

.mathCollection section h2::after {
    background: linear-gradient(to left, #0001, transparent);
    bottom: 0;
    content: '';
    display: block;
    height: 1px;
    left: 0;
    position: absolute;
    width: 100%;
}

.mathCollection section .part {
    display: flex;
    flex-wrap: wrap;
    margin: .5em 0 0;
}

.mathCollection section .part .item {
    align-items: center;
    background-color: #eee;
    border-radius: var(--radius);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
    min-width: 15%;
    opacity: 0;
    padding: 1em;
    position: relative;
    transform: translateY(.5em);
    transition: all .3s .3s ease, background-color .3s ease, color .3s ease;
}

.mathCollection section .part .item:not(:last-child) {
    margin-left: 1em;
}

.mathCollection section .part .item:hover {
    background-color: var(--primary);
    color: #fff;
}

.mathCollection section .part .item.show {
    opacity: 1;
    transform: translateY(0);
}

.mathCollection section .part .item .item-name {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 5px #0002;
    box-sizing: border-box;
    color: #343434;
    font-size: .7em;
    max-width: calc(100% - 2em);
    opacity: 0;
    overflow: hidden;
    padding: .2em .5em;
    pointer-events: none;
    position: absolute;
    right: 1em;
    text-overflow: ellipsis;
    top: calc(100% - 1em);
    transform: translateY(.5em);
    transition: all .3s ease;
    white-space: nowrap;
}

.mathCollection section .part .item .item-name:empty {
    display: none;
}

.mathCollection section .part .item:hover .item-name {
    opacity: 1;
    transform: translateY(0);
}

</style>