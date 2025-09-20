<script setup>
import UrlIcon from "@/components/icons/UrlIcon.vue";

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	IconComponent: {
		type: Object,
		required: true
	},
	description: {
		type: String,
		default: ''
	},
	url: {
      type: [String, Object],
      required: true
    }
})
</script>

<template>
	<router-link :to="url" class="nav-btn">
		<div class="left-side">
			<component :is="IconComponent" class="icon"/>
			<div class="text-block">
				<p class="title">{{ title }}</p>
				<p class="description">{{ description }}</p>
			</div>
		</div>
		<div class="right-side">
			<UrlIcon class="icon"/>
		</div>
	</router-link>

</template>

<style scoped lang="scss">
.nav-btn {
	width: 100%;
	height: 80px;
	border-radius: 10px;
	background-color: var(--sbg1-color);
	display: flex;
	align-items: center;
	padding: 0 20px;
	justify-content: space-between;
	text-decoration: none;
	box-sizing: border-box;
	
	@media (max-width: 768px) {
		height: 70px;
		padding: 0 15px;
	}

	.left-side {
		display: flex;
		gap: 20px;

		@media (max-width: 768px) {
			gap: 12px;
		}

		.icon {
			width: 40px;
			height: 40px;
			stroke: var(--text-color);

			@media (max-width: 768px) {
				width: 32px;
				height: 32px;
			}
		}

		.text-block {
			display: flex;
			flex-direction: column;
			gap: 5px;
			color: var(--text-color);

			.title {
				font-family: "PressStart2P";
				font-size: 18px;
				margin: 0;

				@media (max-width: 768px) {
					font-size: 14px;
				}
				
				@media (max-width: 480px) {
					font-size: 12px;
				}
			}
			.description {
				font-size: 15px;
				text-align: center;
				margin: 0;

				@media (max-width: 768px) {
					font-size: 12px;
				}
			}
		}
	}

	.right-side {
		.icon {
			stroke: var(--text-color);

			@media (max-width: 480px) {
				width: 24px;
				height: 24px;
			}
		}
	}
}
</style>