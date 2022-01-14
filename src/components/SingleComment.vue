<template>
	<div class="single-comment">
		<div class="comment-vote">
			<form>
				<button class="btn btn-upvote" type="button" @click="upVote">
					<i class="fas fa-plus icon-vote"></i>
				</button>
				<input type="number" v-model="vote" />
				<button class="btn btn-downvote" type="button" @click="downVote">
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
						<button class="btn btn-delete" @click="$emit('delete')">
							<i class="fas fa-trash"></i>
							<span>Delete</span>
						</button>
						<button class="btn btn-edit" @click="handleEdit(comment.id)">
							<i class="fas fa-pen"></i>
							<span>Edit</span>
						</button>
					</div>
					<button
						class="btn btn-reply"
						v-else
						@click="$emit('reply', comment.id)"
					>
						<i class="fas fa-reply"></i>
						<span>Reply</span>
					</button>
				</div>
			</div>

			<div class="comment-body">
				<div v-if="">
					<p>
						<span class="replying-to" v-if="comment.replyingTo"
							>@{{ comment.replyingTo }}</span
						>
						{{ comment.content }}
					</p>
				</div>

				<form class="form">
					<textarea
						placeholder="Add a comment..."
						v-model="commentMessage"
					></textarea>
					<button
						class="btn btn-primary"
						type="submit"
						v-if="replyingTo"
						@click.prevent="sendReply"
					>
						Update
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, inject, ref } from 'vue';
import { formatDistance } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/index';

export default {
	name: 'Comment',
	props: ['comment', 'parentComment'],
	setup(props) {
		const vote = ref(props.comment.score);
		const edit = ref(false);
		const error = ref(null);
		const errMessage = ref(null);

		const currentUser = inject('currentUser');

		const ownership = computed(() => {
			return props.comment.user.username === currentUser.value.username;
		});

		const formattedTime = computed(() =>
			formatDistance(props.comment.createdAt.toMillis(), Date.now(), {
				addSuffix: true,
			})
		);

		const upVote = () => {
			vote.value++;
		};

		const downVote = () => {
			vote.value--;
		};

		const handleEdit = async commentId => {
			if (!props.parentComment) {
				const commentSnap = await getDoc(doc(db, 'comments', commentId));
				console.log(commentSnap);
			}
		};

		return {
			vote,
			ownership,
			formattedTime,
			upVote,
			downVote,
			handleEdit,
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
</style>
