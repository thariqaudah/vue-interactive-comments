<template>
	<div>
		<div class="single-comment">
			<div class="comment-vote">
				<form>
					<button
						class="btn btn-upvote"
						:disabled="ownership"
						type="button"
						@click="voting('incr')"
					>
						<i class="fas fa-plus icon-vote"></i>
					</button>
					<input type="number" v-model="vote" />
					<button
						class="btn btn-downvote"
						:disabled="ownership"
						type="button"
						@click="voting('decr')"
					>
						<i class="fas fa-minus icon-vote"></i>
					</button>
				</form>
			</div>
			<div class="comment-main">
				<div class="comment-header">
					<div class="user-profile">
						<img
							class="avatar"
							:src="require(`../assets/avatars/${comment.user.image.png}`)"
							alt="user image"
						/>
						<p class="username">{{ comment.user.username }}</p>
					</div>
					<div class="label" v-if="ownership">you</div>
					<p class="created-at">{{ formattedTime }}</p>
					<div class="action">
						<div v-if="ownership">
							<button class="btn btn-delete" @click="showModal = true">
								<i class="fas fa-trash"></i>
								<span>Delete</span>
							</button>
							<button class="btn btn-edit" @click="editForm = !editForm">
								<i class="fas fa-pen"></i>
								<span>Edit</span>
							</button>
						</div>
						<button class="btn btn-reply" v-else @click="showForm = !showForm">
							<i class="fas fa-reply"></i>
							<span>Reply</span>
						</button>
					</div>
				</div>

				<div class="comment-body">
					<div v-if="!editForm">
						<p>
							<span class="replying-to" v-if="comment.replyingTo"
								>@{{ comment.replyingTo }}</span
							>
							{{ comment.content }}
						</p>
					</div>

					<FormComment
						v-else
						:comment="comment"
						:parentCommentId="parentCommentId"
						@closeEditForm="editForm = false"
					/>
				</div>
			</div>
		</div>

		<!-- Input form comment -->
		<div class="form-container" v-if="showForm">
			<div class="user-profile">
				<img
					class="avatar"
					:src="require(`../assets/avatars/${currentUser.image.png}`)"
					alt="Current user photo"
				/>
			</div>
			<FormComment
				:replyingTo="comment.user.username"
				:parentCommentId="parentCommentId"
				@closeForm="showForm = false"
			/>
		</div>

		<!-- Modal -->
		<modal v-if="showModal">
			<template v-slot:header>Delete comment</template>
			<template v-slot:text>
				Are you sure you want t o delete this comment? This will remove the
				comment and can't be undone.
			</template>
			<template v-slot:btn-secondary>No, cancel</template>
			<template v-slot:btn-danger>Yes, delete</template>
		</modal>
	</div>
</template>

<script>
import { computed, inject, provide, ref } from 'vue';
import { formatDistance } from 'date-fns';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/index';
import FormComment from './FormComment.vue';
import Modal from './Modal.vue';

export default {
	name: 'Comment',
	props: ['comment', 'parentCommentId'],
	components: { FormComment, Modal },
	setup(props) {
		const vote = ref(props.comment.score);
		const showForm = ref(false);
		const editForm = ref(false);
		const showModal = ref(false);

		const currentUser = inject('currentUser');
		const removeComment = inject('removeComment');

		const ownership = computed(() => {
			return props.comment.user.username === currentUser.value.username;
		});

		const formattedTime = computed(() =>
			formatDistance(props.comment.createdAt.toMillis(), Date.now(), {
				addSuffix: true,
			})
		);

		const voting = async option => {
			if (option === 'incr') {
				vote.value++;
			} else if (option === 'decr') {
				vote.value--;
			}

			let commentRef;

			if (props.comment.id === props.parentCommentId) {
				commentRef = doc(db, 'comments', props.comment.id);
			} else {
				commentRef = doc(
					db,
					'comments',
					props.parentCommentId,
					'replies',
					props.comment.id
				);
			}

			await updateDoc(commentRef, {
				score: vote.value,
			});
		};

		const handleModal = async option => {
			if (option === true) {
				await handleDelete();
			}

			showModal.value = false;
		};

		const handleDelete = async () => {
			let commentRef;

			// Check if it is the actual comment, otherwise it's a reply
			if (props.comment.id === props.parentCommentId) {
				commentRef = doc(db, 'comments', props.comment.id);
			} else {
				commentRef = doc(
					db,
					'comments',
					props.parentCommentId,
					'replies',
					props.comment.id
				);
			}

			await deleteDoc(commentRef);
			removeComment(props.parentCommentId, props.comment.id);
		};

		provide('handleModal', handleModal);

		return {
			vote,
			showForm,
			editForm,
			showModal,
			ownership,
			formattedTime,
			currentUser,
			voting,
			handleModal,
			handleDelete,
		};
	},
};
</script>

<style lang="scss" scoped>
.single-comment {
	background-color: #fff;
	display: flex;
	gap: 32px;
	border-radius: 9px;
	padding: 24px;
	margin-bottom: 24px;

	.comment-vote {
		form {
			background-color: #eaecf1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 16px;
			width: 48px;
			padding: 8px;
			border-radius: 9px;
		}

		input[type='number']::-webkit-inner-spin-button,
		input[type='number']::-webkit-outer-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		input[type='number'] {
			-moz-appearance: textfield;
		}

		input[type='number'] {
			display: inline-block;
			background-color: #eaecf1;
			width: 100%;
			border: none;
			outline: none;
			padding: 0;
			margin: 0;
			text-align: center;
			font-size: 18px;
			font-family: inherit;
			font-weight: 500;
			color: #5457b6;
			pointer-events: none;
		}

		.icon-vote {
			font-size: 14px;
			color: #c3c4ef;
			transition: all 0.2s ease;
		}

		.btn-upvote:hover .icon-vote {
			color: #5457b6;
		}

		.btn-downvote:hover .icon-vote {
			color: #5457b6;
		}
	}

	.comment-main {
		width: 100%;
		.comment-header {
			display: flex;
			gap: 12px;
			align-items: center;
			margin-bottom: 16px;

			.user-profile {
				display: flex;
				align-items: center;
				gap: 12px;

				.avatar {
					width: 40px;
					height: 40px;
				}

				.username {
					font-weight: 500;
					color: #324152;
				}
			}

			.label {
				font-size: 14px;
				background-color: #5457b6;
				color: #fff;
				padding: 2px 8px;
				border-radius: 3px;
			}

			.created-at {
				color: #67727e;
			}

			.action {
				margin-left: auto;

				div:first-child {
					display: flex;
					gap: 16px;
				}

				.btn-reply,
				.btn-edit,
				.btn-delete {
					span {
						font-weight: 700;
						margin-left: 8px;
					}
				}

				.btn-reply,
				.btn-edit {
					color: #5457b6;

					&:hover {
						color: #c3c4ef;
					}
				}

				.btn-delete {
					color: #ed6468;

					&:hover {
						color: #ffb8bb;
					}
				}
			}
		}

		.comment-body {
			line-height: 1.6;

			.replying-to {
				font-weight: 500;
				color: #5457b6;
			}
		}
	}
}

.form-container {
	width: 100%;
	margin-bottom: 24px;
	margin-top: -12px;
}
</style>
