<template>
    <window :title="`افزودن ایموجی`" :hideAction="true" @close="close" style="user-select: none;">
        <div class="emoji-picker">
            <div class="search">
                <input v-model="key" type="text" placeholder="جستجو ...">
            </div>

            <div class="emojis">
                <div v-for="(group, name) in selectedEmojis" :key="'emoji-group-' + name" class="group">
                    <div v-if="Object.keys(group).length > 0" class="name">{{ name }}</div>

                    <div v-if="Object.keys(group).length > 0" class="wrapper">
                        <div v-for="(emoji, index) in group" :key="'emoji-' + index" :title="index" class="emoji" @click="done(emoji)">{{ emoji }}</div>
                    </div>
                </div>
            </div>
        </div>
    </window>
</template>

<script>
import window from './window';
import emojiPack from './emojis';

export default {
    data() {
        return {
            emojis: emojiPack,
            key: '',
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        done(emoji) {
            this.$emit('done', emoji);
            this.$emit('close');
        },
    },
    computed: {
        selectedEmojis() {
            if(!this.key) {
                return this.emojis;
            }

            let groups = {};

            for(let group in this.emojis) {
                let found = {};

                for(let emoji in this.emojis[group]) {
                    if(emoji.indexOf(this.key) > -1) {
                        found[emoji] = this.emojis[group][emoji];
                    }
                }

                if(Object.keys(found).length > 0) {
                    groups[group] = found;
                }
            }

            return groups;
        },
    },
    components: {
        window,
    }
}
</script>

<style>

.emoji-picker {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.emoji-picker .search {
    box-sizing: border-box;
    padding: 1em 0;
}

.emoji-picker .search input {
    border: solid 1px #0002;
    border-radius: 100vh;
    box-sizing: border-box;
    color: #343434;
    display: block;
    font-family: inherit;
    font-size: .8em;
    outline: none;
    width: 100%;
    padding: .5em 1em;
}

.emoji-picker .emojis {
    height: 100%;
    max-height: 100%;
    overflow: auto;
}

.emoji-picker .emojis .group .name {
    background: linear-gradient(to left, #0001, transparent);
    border-radius: 100vh;
    box-sizing: border-box;
    font-size: .7em;
    margin: 1em 0 .5em;
    opacity: .8;
    padding: .5em 1em;
}

.emoji-picker .emojis .group .wrapper {
    display: grid;
    font-size: 1.5em;
    grid-template-columns: repeat(auto-fit, 2em);
    grid-template-rows: repeat(auto-fit, 2em);
}

.emoji-picker .emojis .group .wrapper .emoji {
    align-items: center;
    border-radius: 100%;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: 2em;
    justify-content: center;
    width: 2em;
}

.emoji-picker .emojis .group .wrapper .emoji:hover {
    transform: scale(1.2);
}

</style>