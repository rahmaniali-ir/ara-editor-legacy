<template>
    <window :title="`افزودن لینک`" @close="close" @done="done" style="user-select: none;" :hideAction="!isLinkReady">
        <div class="link-maker">
            <div class="form">
                <div class="field en">
                    <label for="link-url">آدرس لینک</label>
                    <input type="text" id="link-url" v-model="url" />
                </div>
                
                <div class="field">
                    <label for="link-text">متن لینک</label>
                    <input type="text" id="link-text" v-model="text" />
                </div>

                <div class="field">
                    <label for="link-title">راهنمای لینک</label>
                    <input type="text" id="link-title" v-model="title" />
                </div>

                <div class="note">
                    <div class="icon" v-html="icons.information"></div>
                    <div class="text">برای باز کردن لینک در ویرایشگر "ctrl + click" کنید.</div>
                </div>
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
            url: '',
            text: '',
            title: '',
            isLinkReady: false,
        }
    },
    watch: {
        url() {
            this.isLinkValid();
        },
        text() {
            this.isLinkValid();
        },
    },
    methods: {
        isLinkValid() {
            this.isLinkReady = (this.url.length != 0) && (this.text.length != 0);
        },
        close() {
            this.$emit('close');
        },
        done() {
            if(!this.url) {
                this.$emit('close');
                return;
            }

            let text = this.text;
            if(!text) {
                text = this.url;
            }

            let link = document.createElement('a');
            link.href = this.url;
            link.innerText = text;
            link.title = this.title;

            this.$emit('done', link.outerHTML);
            this.$emit('close');
        },
    },
    components: {
        window,
    }
}
</script>

<style>

.link-maker .form .field {
    max-width: 100%;
    min-width: 200px;
    width: calc(100% / 3);
}

.link-maker .note {
    align-items: center;
    background-color: #0001;
    border-radius: var(--radius);
    border-right: solid .4em #0001;
    box-sizing: border-box;
    color: #000a;
    display: flex;
    font-size: .8em;
    margin: 2em 0 1em;
    padding: 1em;
}

@media (max-width: 400px) {
    .link-maker .form .field {
        width: 100%;
    }

    .link-maker .note {
        display: none;
    }
}

.link-maker .note .icon {
    height: 1em;
    margin-left: 1em;
    width: 1em;
}

.link-maker .note .icon svg {
    display: block;
    fill: currentColor;
    height: 100%;
    width: 100%;
}

</style>