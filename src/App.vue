<template>
	<div class="app">
		<!-- Comments -->
		<div class="comments">
			<ul class="comment-list">
				<li v-for="comment in orderedComments" :key="comment.id">
					<SingleComment :comment="comment" :parentCommentId="comment.id" />

					<!-- Comment replies -->
					<div class="replies" v-if="comment.replies">
						<ul class="comment-list">
							<li v-for="reply in comment.replies" :key="reply.id">
								<SingleComment :comment="reply" :parentCommentId="comment.id" />
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>

		<!-- Form Comment -->
		<div class="form-container">
			<div class="user-profile">
				<img
					class="avatar"
					:src="require(`./assets/avatars/${currentUser.image.png}`)"
					alt="Current user photo"
				/>
			</div>
			<FormComment />
		</div>
	</div>
</template>

<script>
import { computed, onMounted, provide, ref } from 'vue';
import SingleComment from './components/SingleComment.vue';
import FormComment from './components/FormComment.vue';
import { db } from './firebase/index';
import {
	collection,
	doc,
	getDocs,
	getDoc,
	query,
	orderBy,
} from 'firebase/firestore';

export default {
	name: 'App',
	components: {
		SingleComment,
		FormComment,
	},
	setup() {
		const comments = ref([]);
		const currentUser = ref({
			image: {
				png: 'image-juliusomo.png',
				webp: 'image-juliusomo.webp',
			},
			username: 'juliusomo',
		}); // Pretend it comes from database
		const showForm = ref(null);
		const commentId = ref(null);

		const orderedComments = computed(() => {
			let ordered = comments.value;
			return ordered.sort(
				(firstEl, secondEl) => secondEl.score - firstEl.score
			);
		});

		// Handle UI
		const addComment = async commentId => {
			const commentSnap = await getDoc(doc(db, 'comments', commentId));
			comments.value.push({
				id: commentSnap.id,
				...commentSnap.data(),
				replies: [],
			});
		};

		const addReply = async (commentId, newReply) => {
			const comment = comments.value.find(comm => comm.id === commentId);
			if (comment) {
				comment.replies.push(newReply);
			}
		};

		const removeComment = (commentId, replyId) => {
			if (commentId === replyId) {
				comments.value = comments.value.filter(
					comment => comment.id !== commentId
				);
				return;
			}

			comments.value = comments.value.map(comment => {
				if (comment.id === commentId) {
					comment.replies = comment.replies.filter(
						reply => reply.id !== replyId
					);
					return comment;
				}

				return comment;
			});
		};

		const editComment = (commentId, replyId, updatedContent) => {
			if (commentId === replyId) {
				comments.value = comments.value.map(comment => {
					if (comment.id === commentId) {
						comment.content = updatedContent;
					}
					return comment;
				});
				return;
			}

			comments.value = comments.value.map(comment => {
				if (comment.id === commentId) {
					comment.replies = comment.replies.map(reply => {
						if (reply.id === replyId) {
							reply.content = updatedContent;
						}
						return reply;
					});
					return comment;
				}

				return comment;
			});
		};

		onMounted(async () => {
			const querySnapshot = await getDocs(collection(db, 'comments'));
			querySnapshot.forEach(async doc => {
				const comment = {
					id: doc.id,
					...doc.data(),
					replies: [],
				};

				// Check if comment has replies
				const repliesRef = collection(db, 'comments', doc.id, 'replies');
				const queryReplies = query(repliesRef, orderBy('createdAt'));
				const repliesSnap = await getDocs(queryReplies);
				if (repliesSnap.docs.length > 0) {
					repliesSnap.docs.forEach(reply => {
						comment.replies.push({
							id: reply.id,
							...reply.data(),
						});
					});
				}

				// Push to comments state
				comments.value.push(comment);
			});
		});

		provide('currentUser', currentUser);
		provide('addComment', addComment);
		provide('addReply', addReply);
		provide('removeComment', removeComment);
		provide('editComment', editComment);

		return {
			currentUser,
			comments,
			showForm,
			commentId,
			orderedComments,
		};
	},
};
</script>

<style lang="scss">
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

body {
	font-family: 'Rubik', sans-serif;
	background-color: #f5f6fa;
	color: #67727e;
}

.app {
	width: 100%;
	max-width: 1440px;
	margin: 0 auto;
	padding: 64px 32px;
}

.btn {
	display: inline-block;
	font-size: 16px;
	background: none;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-primary {
	background-color: #5457b6;
	color: #fff;
	padding: 12px 24px;
	border-radius: 9px;
	text-transform: uppercase;
	font-weight: 700;

	&:hover {
		background-color: #c3c4ef;
	}
}

.btn-danger {
	background-color: #ed6468;
	color: #fff;
	padding: 12px 24px;
	border-radius: 9px;
	text-transform: uppercase;
	font-weight: 700;

	&:hover {
		background-color: #ffb8bb;
	}
}

.btn-secondary {
	background-color: #67727e;
	color: #fff;
	padding: 12px 24px;
	border-radius: 9px;
	text-transform: uppercase;
	font-weight: 700;

	&:hover {
		background-color: #eaecf1;
		color: #324152;
	}
}

.comments,
.form-container {
	width: 55%;
	margin: 0 auto;
}

.comment-list {
	list-style: none;
}

.replies {
	margin-left: 32px;
	padding-left: 32px;
	border-left: 2px solid hsl(223, 19%, 93%);
}

.form-container {
	background-color: #fff;
	display: flex;
	align-items: flex-start;
	gap: 16px;
	border-radius: 9px;
	padding: 24px;

	.user-profile {
		display: flex;
		justify-content: center;
		align-items: center;

		.avatar {
			width: 50px;
			height: 50px;
		}
	}
}
</style>
