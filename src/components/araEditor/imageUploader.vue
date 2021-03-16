<template>
    <window :title="`افزودن عکس`" @close="close" @done="done" style="user-select: none;" class="image-uploader" :hideAction="!isImageReady">
        <label class="uploadArea" for="uploadImage"
            @dragenter="dragEnterImage" @dragleave="dragLeaveImage" @dragover="dragImage" @drop="dropImage">
            <span class="overlay" v-html="icons.upload"></span>

            <div class="hint">
                <span class="icon" v-html="icons.upload"></span>
                <span class="text">
                    <div class="click">
                        <span>کلیک</span>
                        کنید یا اینجا
                    </div>

                    <span>رها</span>
                    کنید!
                </span>
                <input type="file" id="uploadImage" @change="uploadImage">
            </div>

            <div class="uploaded" :class="[uploadedImage.length > 0 ? 'show' : '']">
                <div class="blur" :style="{'background-image': `url(${ uploadedImage })`}"></div>
                <img :src="uploadedImage">
            </div>
        </label>
    </window>
</template>

<script>
import window from './window';
import iconPack from './icons';

export default {
    data() {
        return {
            icons: iconPack,
            uploadedImage: '',
            isImageReady: false,
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        done() {
            this.$emit('done', this.uploadedImage);
        },
        uploadImage() {
            let inputElement = document.querySelector('#uploadImage');

            // File reader
            let reader = new FileReader();
            reader.addEventListener('load', () => {
                this.uploadedImage = reader.result;
                inputElement.value = null;
                let uploaded = document.querySelector('.image-uploader .uploaded');
                uploaded.classList.add('show');
                this.isImageReady = true;
                console.log(this.isImageReady);
            });

            reader.readAsDataURL(inputElement.files[0]);
        },
        dragEnterImage() {
            let uploadArea = document.querySelector('.image-uploader .uploadArea');
            uploadArea.classList.add('ready');
        },
        dragLeaveImage() {
            let uploadArea = document.querySelector('.image-uploader .uploadArea');
            uploadArea.classList.remove('ready');
        },
        dragImage(e) {
            e.preventDefault();
        },
        dropImage(e) {
            e.preventDefault();

            let file = e.dataTransfer.files[0];

            let reader = new FileReader();
            reader.addEventListener('load', () => {
                this.uploadedImage = reader.result;

                let uploadArea = document.querySelector('.image-uploader .uploadArea');
                uploadArea.classList.remove('ready');
            });

            reader.readAsDataURL(file);
        },
        addImage() {
            // Create image element
            let image = document.createElement('div');
            image.classList.add('image');

            let imageElement = document.createElement('img');
            image.appendChild(imageElement);

            imageElement.src = this.uploadedImage;

            let space = document.createElement('span');
            space.classList.add('space');
            let space2 = document.createElement('span');
            space2.classList.add('space');

            this.editor.appendChild(space);
            this.editor.appendChild(image);
            this.editor.appendChild(space2);

            // Hide dialog
            this.runCommand(['toggle'], { target: '.image-uploader' });
        },
    },
    components: {
        window
    },
}
</script>

<style>

.image-uploader .imageArea {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.image-uploader .uploadArea {
    align-items: center;
    border: dashed 1px #ababab;
    border-radius: var(--radius);
    color: #343434;
    cursor: pointer;
    display: flex;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.image-uploader .uploadArea > * {
    pointer-events: none;
}

.image-uploader .uploadArea:hover {
    border-color: #898989;
}

.image-uploader .uploadArea .overlay {
    color: #eee;
    height: 300%;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 70%;
}

@media (max-width: 400px) {
    .image-uploader .uploadArea .overlay {
        display: none;
    }
}

.image-uploader .uploadArea .hint {
    transition: all .3s ease;
    z-index: 1;
}

.image-uploader .uploadArea.ready .hint {
    transform: scale(1.1);
}

.image-uploader .uploadArea span {
    display: block;
}

.image-uploader .uploadArea span.text span {
    color: var(--primary);
    display: inline;
    font-weight: bold;
}

.image-uploader .uploadArea span.text > div {
    display: inline-block;
    transition: all .3s ease;
    vertical-align: middle;
}

@media (max-width: 400px) {
    .image-uploader .uploadArea span.text {
        font-size: .8em;
    }
}

.image-uploader .uploadArea.ready span.text .click {
    display: none;
}

.image-uploader .uploadArea .icon {
    height: 4em;
    margin: 1em auto;
    width: 4em;
}

.image-uploader .uploadArea svg {
    display: block;
    fill: currentColor;
    height: 100%;
    opacity: .5;
    transition: opacity .3s ease;
    width: 100%;
}

.image-uploader .uploadArea:hover .icon svg {
    opacity: .8;
    transform: scale(1.1);
}

.image-uploader .uploadArea input {
    left: 0;
    top: 0;
    position: absolute;
    visibility: hidden;
}

.image-uploader .uploadArea .uploaded {
    backface-visibility: hidden;
    background-color: #343434;
    border-radius: var(--radius);
    display: none;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 2;
}

.image-uploader .uploadArea .uploaded.show {
    display: block;
}

.image-uploader .uploadArea .uploaded .blur {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(3px) grayscale(80%);
    height: 100%;
    left: 0;
    opacity: .8;
    position: absolute;
    transition: all .3s ease;
    top: 0;
    width: 100%;
    z-index: 0;
}

.image-uploader .uploadArea .uploaded img {
    display: block;
    height: 100%;
    margin: 0 auto;
    max-width: 100%;
    object-fit: contain;
    position: relative;
    transition: all .3s ease;
    z-index: 1;
}

.image-uploader .details {
    align-items: center;
    display: flex;
    margin-top: 1em;
}

.image-uploader .details .left {
    direction: ltr;
    height: 3em;
    position: relative;
    text-align: left;
    width: 100%;
}

.image-uploader .details .left::before {
    background: linear-gradient(to left, #fff, transparent);
    content: '';
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 20%;
}

.image-uploader .details img {
    background-color: #eee;
    border-radius: var(--radius);
    display: inline-block;
    height: 100%;
    width: 4em;
}

</style>