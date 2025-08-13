<template>
    <span :class="containerClass" :style="style" v-bind="ptmi('root')">
        <slot name="image" :errorCallback="onError">
            <img :style="imageStyle" :class="imageClass" @error="onError" v-bind="{ ...$attrs, ...ptm('image') }" :src="currentImageSrc" />
        </slot>
        <button v-if="preview" ref="previewButton" :aria-label="zoomImageAriaLabel" type="button" :class="cx('previewMask')" @click="onImageClick" v-bind="{ ...previewButtonProps, ...ptm('previewMask') }">
            <!-- TODO: indicator* deprecated since v4.0-->
            <slot :name="$slots.previewicon ? 'previewicon' : 'indicatoricon'">
                <component :is="previewIcon || indicatorIcon ? 'i' : 'EyeIcon'" :class="cx('previewIcon')" v-bind="ptm('previewIcon')" />
            </slot>
        </button>
        
        <!-- Badge для количества страниц -->
        <div v-if="hasMultiplePages" class="pages-badge">
            <span>{{ pages.length }}</span>
        </div>
        
        <Portal>
            <div v-if="maskVisible" :ref="maskRef" v-focustrap role="dialog" :class="cx('mask')" :aria-modal="maskVisible" @click="onMaskClick" @keydown="onMaskKeydown" v-bind="ptm('mask')">
                <div :class="cx('toolbar')" v-bind="ptm('toolbar')">
                    <button :class="cx('rotateRightButton')" @click="rotateRight" type="button" :aria-label="rightAriaLabel" v-bind="ptm('rotateRightButton')" data-pc-group-section="action">
                        <slot name="refresh">
                            <RefreshIcon v-bind="ptm('rotateRightIcon')" />
                        </slot>
                    </button>

                    <button :class="cx('rotateLeftButton')" @click="rotateLeft" type="button" :aria-label="leftAriaLabel" v-bind="ptm('rotateLeftButton')" data-pc-group-section="action">
                        <slot name="undo">
                            <UndoIcon v-bind="ptm('rotateLeftIcon')" />
                        </slot>
                    </button>

                    <button :class="cx('zoomOutButton')" @click="zoomOut" type="button" :disabled="isZoomOutDisabled" :aria-label="zoomOutAriaLabel" v-bind="ptm('zoomOutButton')" data-pc-group-section="action">
                        <slot name="zoomout">
                            <SearchMinusIcon v-bind="ptm('zoomOutIcon')" />
                        </slot>
                    </button>

                    <button :class="cx('zoomInButton')" @click="zoomIn" type="button" :disabled="isZoomInDisabled" :aria-label="zoomInAriaLabel" v-bind="ptm('zoomInButton')" data-pc-group-section="action">
                        <slot name="zoomin">
                            <SearchPlusIcon v-bind="ptm('zoomInIcon')" />
                        </slot>
                    </button>

                    <!-- Navigation buttons for multiple pages -->
                    <button v-if="hasMultiplePages" :class="['p-image-action', 'p-image-prev-button']" @click="prevPage" type="button" :disabled="currentPage === 0" :aria-label="'Previous page'" data-pc-group-section="action">
                        <ChevronLeftIcon />
                    </button>

                    <button v-if="hasMultiplePages" :class="['p-image-action', 'p-image-next-button']" @click="nextPage" type="button" :disabled="currentPage === pages.length - 1" :aria-label="'Next page'" data-pc-group-section="action">
                        <ChevronRightIcon />
                    </button>

                    <button :class="cx('closeButton')" type="button" @click="hidePreview" :aria-label="closeAriaLabel" autofocus v-bind="ptm('closeButton')" data-pc-group-section="action">
                        <slot name="close">
                            <TimesIcon v-bind="ptm('closeIcon')" />
                        </slot>
                    </button>
                </div>
                <transition name="p-image-original" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" @before-leave="onBeforeLeave" @after-leave="onAfterLeave" v-bind="ptm('transition')">
                    <div v-if="previewVisible" :class="['p-image-preview-container', { 'has-navigation': hasMultiplePages }]" v-bind="ptm('originalContainer')">
                        <!-- Left navigation arrow -->
                        <button v-if="hasMultiplePages" 
                            class="p-image-side-nav p-image-side-nav-left" 
                            @click="prevPage" 
                            type="button" 
                            :disabled="currentPage === 0"
                            :aria-label="'Previous page'">
                            <ChevronLeftIcon />
                        </button>
                        
                        <!-- TODO: preview deprecated since v4.0-->
                        <slot :name="$slots.original ? 'original' : 'preview'" :class="cx('original')" :style="imagePreviewStyle" :previewCallback="onPreviewImageClick">
                            <img :src="currentPreviewImageSrc" :class="cx('original')" :style="imagePreviewStyle" @click="onPreviewImageClick" v-bind="ptm('original')" />
                        </slot>
                        
                        <!-- Right navigation arrow -->
                        <button v-if="hasMultiplePages" 
                            class="p-image-side-nav p-image-side-nav-right" 
                            @click="nextPage" 
                            type="button" 
                            :disabled="currentPage === pages.length - 1"
                            :aria-label="'Next page'">
                            <ChevronRightIcon />
                        </button>
                    </div>
                </transition>

                <!-- Page indicator -->
                <div v-if="hasMultiplePages" class="p-image-page-indicator">
                    {{ currentPage + 1 }} / {{ pages.length }}
                </div>
            </div>
        </Portal>
    </span>
</template>

<script>
import { blockBodyScroll, isAttributeEquals, focus, addClass, unblockBodyScroll } from '@primeuix/utils/dom';
import { ZIndex } from '@primeuix/utils/zindex';
import EyeIcon from '@primevue/icons/eye';
import RefreshIcon from '@primevue/icons/refresh';
import SearchMinusIcon from '@primevue/icons/searchminus';
import SearchPlusIcon from '@primevue/icons/searchplus';
import TimesIcon from '@primevue/icons/times';
import UndoIcon from '@primevue/icons/undo';
import ChevronLeftIcon from '@primevue/icons/chevronleft';
import ChevronRightIcon from '@primevue/icons/chevronright';
import FocusTrap from 'primevue/focustrap';
import Portal from 'primevue/portal';
import BaseImage from './BaseMultiPageImage.vue';

export default {
    name: 'MultiPageImage',
    extends: BaseImage,
    inheritAttrs: false,
    emits: ['show', 'hide', 'error', 'page-change'],
    props: {
        pages: {
            type: Array,
            default: () => []
        }
    },
    mask: null,
    data() {
        return {
            maskVisible: false,
            previewVisible: false,
            rotate: 0,
            scale: 1,
            currentPage: 0
        };
    },
    computed: {
        hasMultiplePages() {
            return this.pages && this.pages.length > 1;
        },
        currentImageSrc() {
            if (this.hasMultiplePages && this.pages[this.currentPage]) {
                return this.pages[this.currentPage];
            }
            return this.pages?.[0] || this.$attrs.src;
        },
        currentPreviewImageSrc() {
            if (this.hasMultiplePages && this.pages[this.currentPage]) {
                return this.pages[this.currentPage];
            }
            return this.pages?.[0] || this.$attrs.src;
        },
        containerClass() {
            return [this.cx('root'), this.class, 'multi-page-image-container'];
        },
        rotateClass() {
            return 'p-image-preview-rotate-' + this.rotate;
        },
        imagePreviewStyle() {
            return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' };
        },
        isZoomInDisabled() {
            return this.zoomInDisabled || this.scale >= 1.5;
        },
        isZoomOutDisabled() {
            return this.zoomOutDisabled || this.scale <= 0.5;
        },
        rightAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.rotateRight : undefined;
        },
        leftAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.rotateLeft : undefined;
        },
        zoomInAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.zoomIn : undefined;
        },
        zoomOutAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.zoomOut : undefined;
        },
        zoomImageAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.zoomImage : undefined;
        },
        closeAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : undefined;
        }
    },
    beforeUnmount() {
        if (this.mask) {
            ZIndex.clear(this.container);
        }
    },
    methods: {
        maskRef(el) {
            this.mask = el;
        },
        toolbarRef(el) {
            this.toolbarRef = el;
        },
        onImageClick() {
            if (this.preview) {
                blockBodyScroll();
                this.maskVisible = true;
                setTimeout(() => {
                    this.previewVisible = true;
                }, 25);
            }
        },
        onPreviewImageClick() {
            this.previewClick = true;
        },
        onMaskClick(event) {
            const isBarActionsClicked = isAttributeEquals(event.target, 'data-pc-section-group', 'action') || event.target.closest('[data-pc-section-group="action"]');

            if (!this.previewClick && !isBarActionsClicked) {
                this.previewVisible = false;
                this.rotate = 0;
                this.scale = 1;
            }

            this.previewClick = false;
        },
        onMaskKeydown(event) {
            switch (event.code) {
                case 'Escape':
                    this.hidePreview();
                    setTimeout(() => {
                        focus(this.$refs.previewButton);
                    }, 200);
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (this.hasMultiplePages) {
                        this.prevPage();
                        event.preventDefault();
                    }
                    break;
                case 'ArrowRight':
                    if (this.hasMultiplePages) {
                        this.nextPage();
                        event.preventDefault();
                    }
                    break;
                default:
                    break;
            }
        },
        onError() {
            this.$emit('error');
        },
        rotateRight() {
            this.rotate += 90;
            this.previewClick = true;
        },
        rotateLeft() {
            this.rotate -= 90;
            this.previewClick = true;
        },
        zoomIn() {
            this.scale = this.scale + 0.1;
            this.previewClick = true;
        },
        zoomOut() {
            this.scale = this.scale - 0.1;
            this.previewClick = true;
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.resetTransform();
                this.$emit('page-change', this.currentPage);
            }
        },
        nextPage() {
            if (this.currentPage < this.pages.length - 1) {
                this.currentPage++;
                this.resetTransform();
                this.$emit('page-change', this.currentPage);
            }
        },
        resetTransform() {
            this.rotate = 0;
            this.scale = 1;
            this.previewClick = true;
        },
        onBeforeEnter() {
            ZIndex.set('modal', this.mask, this.$primevue.config.zIndex.modal);
        },
        onEnter() {
            this.focus();
            this.$emit('show');
        },
        onBeforeLeave() {
            !this.isUnstyled && addClass(this.mask, 'p-overlay-mask-leave');
        },
        onLeave() {
            unblockBodyScroll();
            this.$emit('hide');
        },
        onAfterLeave(el) {
            ZIndex.clear(el);
            this.maskVisible = false;
        },
        focus() {
            let focusTarget = this.mask.querySelector('[autofocus]');

            if (focusTarget) {
                focusTarget.focus();
            }
        },
        hidePreview() {
            this.previewVisible = false;
            this.rotate = 0;
            this.scale = 1;
            unblockBodyScroll();
        }
    },
    components: {
        Portal: Portal,
        EyeIcon: EyeIcon,
        RefreshIcon: RefreshIcon,
        UndoIcon: UndoIcon,
        SearchMinusIcon: SearchMinusIcon,
        SearchPlusIcon: SearchPlusIcon,
        TimesIcon: TimesIcon,
        ChevronLeftIcon: ChevronLeftIcon,
        ChevronRightIcon: ChevronRightIcon
    },
    directives: {
        focustrap: FocusTrap
    }
};
</script>

<style>
.multi-page-image-container {
    position: relative;
    display: inline-block;
}

.multi-page-image-container img {
    max-width: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    display: block;
}

.pages-badge {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 13px;
  padding: 13px 9px;
  border-radius: 50%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 5px;
  right: 5px;
}

.pages-badge i {
    font-size: 16px;
}

.p-image-action {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #f8f9fa;
    background: transparent;
    width: 3rem;
    height: 3rem;
    margin: 0 0.5rem;
    border: 0 none;
    padding: 0;
    border-radius: 30px;
    outline-color: transparent;
    transition: background-color 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s, outline-color 0.15s;
    cursor: pointer;
}

.p-image-action:enabled:hover {
    color: #f8f9fa;
    background: rgba(255, 255, 255, 0.1);
}

.p-image-action:focus-visible {
    outline: 0.125rem solid var(--p-focus-ring-color);
    outline-offset: 0.125rem;
}

.p-image-action:disabled {
    opacity: 0.38;
    cursor: auto;
}

.p-image-prev-button,
.p-image-next-button {
    font-size: 1.125rem;
}

.p-image-page-indicator {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    z-index: 1001;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    white-space: nowrap;
    min-width: auto;
    display: inline-block;
    line-height: 1.2;
}

/* Side navigation arrows */
.p-image-preview-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-image-side-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1002;
    backdrop-filter: blur(4px);
}

.p-image-side-nav:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
}

.p-image-side-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.p-image-side-nav-left {
    left: 1rem;
}

.p-image-side-nav-right {
    right: 1rem;
}

.p-image-side-nav svg {
    font-size: 1.25rem;
}

/* Dark mode adjustments */
.p-dark .p-image-page-indicator {
    background: rgba(255, 255, 255, 0.1);
    color: #f8f9fa;
    border-color: rgba(255, 255, 255, 0.2);
}

.p-dark .p-image-side-nav {
    background: rgba(255, 255, 255, 0.1);
    color: #f8f9fa;
}

.p-dark .p-image-side-nav:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
}
</style>
