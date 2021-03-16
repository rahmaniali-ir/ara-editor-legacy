<template>
    <div ref="window" class="window">
        <nav>
            <button class="icon-button" v-html="icons.close" @click="close"></button>
        </nav>

        <div class="window-wrapper">
            <header>
                <h1>{{ title ? title : '' }}</h1>
            </header>

            <div class="content">
                <slot></slot>
            </div>

            <div v-if="!action" class="action">
                <button class="icon-button success" v-html="icons.check" @click="done"></button>
            </div>
        </div>
    </div>
</template>

<script>
import iconPack from './icons';

export default {
    props: {
        title: String,
        hideAction: Boolean,
    },
    data() {
        return {
            icons: iconPack,
            action: false,
        };
    },
    methods: {
        close() {
            this.$refs.window.style.display = 'none';
            this.$emit('close');
        },
        done() {
            this.$emit('close');
            this.$emit('done');
        },
    },
    watch: {
        hideAction() {
            this.action = this.hideAction;
        }
    },
    mounted() {
        this.action = this.hideAction;
    },
}
</script>

<style>

@keyframes come-up {
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.window {
    animation: come-up .3s ease forwards;
    background-color: #000b;
    border-radius: var(--radius);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    opacity: 0;
    padding: 1rem;
    position: absolute;
    top: 0;
    transform: translateY(.5em);
    width: 100%;
}

.window > nav {
    animation: come-up .3s .1s ease forwards;
    margin-bottom: 1em;
    opacity: 0;
    transform: translateY(.5em);
}

.icon-button {
    background-color: #0008;
    border-radius: 50%;
    box-sizing: border-box;
    font-size: 1rem;
    opacity: .8;
    outline: none;
    padding: .5em;
    transition: all .3s ease;
}

.icon-button:hover {
    opacity: 1;
}

.icon-button svg {
    display: block;
    fill: #fff;
    height: .8em;
    width: .8em;
}

.icon-button:active svg {
    transform: scale(.8);
}

.icon-button.success {
    background-color: var(--primary);
}

.window .window-wrapper {
    animation: come-up .3s .2s ease forwards;
    background-color: #fff;
    border-radius: var(--radius);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    opacity: 0;
    padding: 1em;
    transform: translateY(.5em);
}

.window .window-wrapper header h1 {
    color: #343434;
    font-size: 1.2em;
    margin: 0 0 .5em;
}

.window .window-wrapper header h1:empty {
    margin: 0;
}

.window .window-wrapper > .content {
    height: 100%;
    overflow: auto;
}

.window .window-wrapper > .action {
    margin-top: .8em;
}

</style>