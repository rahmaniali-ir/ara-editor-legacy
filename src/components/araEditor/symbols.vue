<template>
    <window :title="title" :hideAction="true" @close="close" style="user-select: none;">
        <div class="SymbolsWrapper">
            <section v-for="(group, groupName) in symbols" :key="`mathSymbolGroup-${ groupName }`">
                <h2>{{ groupName }}</h2>

                <div class="group-content">
                    <div v-for="(symbol, index) in group" :key="`mathSymbolGroup-${ groupName }-item-${ index }`"
                        v-html="symbol.icon"
                        :title="symbol.name"
                        @click="done(symbol.icon)"
                        class="item"
                        ></div>
                </div>
            </section>
        </div>
    </window>
</template>

<script>
import window from './window';

export default {
    props: {
        symbols: Object,
        title: String,
    },
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit('close');
        },
        done(symbol) {
            this.$emit('done', symbol);
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

.SymbolsWrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.SymbolsWrapper > section {
    margin-top: 1em;
}

.SymbolsWrapper > section:last-child {
    height: 100%;
}

.SymbolsWrapper > section h2 {
    background: linear-gradient(to left, #0001, transparent);
    border-radius: 100vh;
    box-sizing: border-box;
    font-size: .7em;
    margin: 1em 0 .5em;
    opacity: .8;
    padding: .5em 1em;
}

.SymbolsWrapper > section .group-content {
    display: grid;
    font-size: 1.2em;
    grid-gap: .5em;
    grid-template-columns: repeat(auto-fit, 2em);
    grid-template-rows: repeat(auto-fit, 2em);
    height: 100%;
}

.SymbolsWrapper > section .group-content .item {
    border-radius: 50%;
    cursor: pointer;
    height: 100%;
    position: relative;
    transition: all .3s ease;
    width: 100%;
}

.SymbolsWrapper > section .group-content .item:hover {
    background-color: #0001;
}

.SymbolsWrapper > section .group-content .item svg {
    display: block;
    height: .8em;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: .8em;
}

</style>