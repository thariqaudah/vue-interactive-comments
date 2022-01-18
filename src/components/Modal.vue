<template>
	<div class="modal-backdrop">
		<div class="modal">
			<p class="modal-header">
				<slot name="header"></slot>
			</p>
			<p class="modal-text">
				<slot name="text"></slot>
			</p>
			<div class="modal-actions">
				<button class="btn btn-secondary" @click="handleModal(false)">
					<slot name="btn-secondary"></slot>
				</button>
				<button class="btn btn-danger" @click="handleModal(true)">
					<slot name="btn-danger"></slot>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { inject } from 'vue';

export default {
	name: 'Modal',
	setup() {
		const handleModal = inject('handleModal');

		return { handleModal };
	},
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);

	.modal {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		width: 400px;
		padding: 32px;
		border-radius: 9px;

		.modal-header {
			font-size: 24px;
			font-weight: 500;
			color: #324152;
			margin-bottom: 16px;
		}

		.modal-text {
			line-height: 1.6;
			margin-bottom: 16px;
		}

		.modal-actions {
			display: flex;
			gap: 16px;
		}
	}
}
</style>
